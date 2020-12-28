import { CalculationOperator } from "../enums/operators/calculation-operator";
import { ComparisonOperator } from "../enums/operators/comparison-operator";
import { ConditionOperator } from "../enums/operators/condition-operator";
import { StringDictionary } from "../types/dictionaries";
import { BasicLexers } from "./basic-lexers";
import { CalculationExpression } from "./expressions/calculation-expression";
import { OperatorExpression } from "./expressions/operator-expression";
import { Lexer } from "./lexers/lexer";
import { StringLexer } from "./lexers/string-lexer";

export class CalculationLexers {
    static ComparisonOperator = new StringLexer(
        'ComparisonOperator',
        [ComparisonOperator.EqualTo, '|', ComparisonOperator.NotEqualTo, '|', ComparisonOperator.NoLessThan, '|', ComparisonOperator.NoGreaterThan, '|', ComparisonOperator.LessThan, '|', ComparisonOperator.GreaterThan]);

    static CalculationOperator = new StringLexer(
        'CalculationOperator',
        [CalculationOperator.Plus.toLexerString(), '|', CalculationOperator.Minus, '|', CalculationOperator.MultiplyBy.toLexerString(), '|', CalculationOperator.DividedBy]
    );

    static Operator = new Lexer<OperatorExpression>(
        'Operator',
        [CalculationLexers.ComparisonOperator, '|', CalculationLexers.CalculationOperator, '|', ConditionOperator.And, '|', ConditionOperator.Or.toLexerString()],
        node => {
            if (node[0].Expression) {
                return {
                    Type: 'Comparison',
                    Operator: node[0].Expression
                }
            };

            if (node[1].Expression) {
                return {
                    Type: 'Calculation',
                    Operator: node[1].Expression
                }
            }

            return {
                Type: 'Condition',
                Operator: node.Value
            }
        });

    static OperatorPriorities: StringDictionary<number> = {
        [ConditionOperator.Prior]: 0,
        [ConditionOperator.Is]: -1,
        [ConditionOperator.Not]: -2,
        [CalculationOperator.MultiplyBy]: -3,
        [CalculationOperator.DividedBy]: -3,
        [CalculationOperator.Plus]: -4,
        [CalculationOperator.Minus]: -5,
        [ComparisonOperator.EqualTo]: -6,
        [ComparisonOperator.NotEqualTo]: -6,
        [ComparisonOperator.GreaterThan]: -6,
        [ComparisonOperator.LessThan]: -6,
        [ComparisonOperator.NoGreaterThan]: -6,
        [ComparisonOperator.NoLessThan]: -6,
        [ConditionOperator.And]: -7,
        [ConditionOperator.Or]: -8
    }

    static Calculation: Lexer<CalculationExpression> = new Lexer<CalculationExpression>(
        'Calculation',
        [
            BasicLexers.Value,
            '|', ConditionOperator.Not, BasicLexers.CodeBreak, () => CalculationLexers.Calculation,
            '|', '('.toLexerString(), BasicLexers.CodeBreak, () => CalculationLexers.Calculation, BasicLexers.CodeBreak, ')'.toLexerString(),
            '|', BasicLexers.SelectField,
            '|', () => CalculationLexers.Calculation, BasicLexers.CodeBreak, CalculationLexers.Operator, BasicLexers.CodeBreak, () => CalculationLexers.Calculation,
        ],
        node => {
            if (node[0].Expression !== undefined) {
                return {
                    Operator: {
                        Type: 'Condition',
                        Operator: ConditionOperator.Is
                    },
                    Left: node[0].Expression
                }
            }

            if (node[2].Expression !== undefined) {
                let notPriority = CalculationLexers.OperatorPriorities[ConditionOperator.Not];
                let notOperator = {
                    Type: 'Condition',
                    Operator: ConditionOperator.Not
                };
                let top: CalculationExpression = {
                    Operator: notOperator,
                    Left: node[2].Expression
                };
                let mid = top;

                while (CalculationLexers.OperatorPriorities[(mid.Left as CalculationExpression).Operator.Operator] <= notPriority) {
                    let left = (mid.Left as CalculationExpression);

                    mid.Operator = left.Operator;
                    mid.Right = left.Right;
                    mid.Left = {
                        Operator: notOperator,
                        Left: left.Left,
                    }

                    mid = mid.Left;
                }

                return top;
            }

            if (node[4].Expression !== undefined) {
                return {
                    Operator: {
                        Type: 'Condition',
                        Operator: ConditionOperator.Prior
                    },
                    Left: node[4].Expression
                };
            }

            if (node[6].Expression != undefined) {
                return {
                    Operator: {
                        Type: 'Condition',
                        Operator: ConditionOperator.Is
                    },
                    Left: node[6].Expression
                }
            }

            let left = node[7].Expression;
            let right = node[11].Expression;
            let mid;
            let leftPriority = CalculationLexers.OperatorPriorities[left.Operator.Operator];
            let midPriority = CalculationLexers.OperatorPriorities[node[9].Expression.Operator];
            let rightPriority = CalculationLexers.OperatorPriorities[right.Operator.Operator];

            if (leftPriority >= midPriority) {
                mid = {
                    Operator: node[9].Expression,
                    Left: left,
                    Right: right.Left
                };
            } else {
                mid = {
                    Operator: left.Operator,
                    Left: left.Left,
                    Right: {
                        Operator: node[9].Expression,
                        Left: left.Right,
                        Right: right.Left
                    }
                };
                
                midPriority = leftPriority;
            }

            return midPriority >= rightPriority
                ? {
                    Operator: right.Operator,
                    Left: mid,
                    Right: right.Right
                }
                : {
                    Operator: mid.Operator,
                    Left: mid.Left,
                    Right: {
                        Operator: right.Operator,
                        Left: mid.Right,
                        Right: right.Right
                    }
                };
        });
}
