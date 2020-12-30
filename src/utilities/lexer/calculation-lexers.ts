import { StringDictionary } from "../types/dictionaries";
import { Operator } from "../types/operators";
import { BasicLexers } from "./basic-lexers";
import { CalculationExpression } from "./expressions/calculation-expression";
import { Lexer } from "./lexers/lexer";
import { StringLexer } from "./lexers/string-lexer";

export class CalculationLexers {
    static ComparisonOperator = new StringLexer(
        'ComparisonOperator',
        [Operator.EqualTo, '|', Operator.NotEqualTo, '|', Operator.NoLessThan, '|', Operator.NoGreaterThan, '|', Operator.LessThan, '|', Operator.GreaterThan]);

    static CalculationOperator = new StringLexer(
        'CalculationOperator',
        [Operator.Plus.toLexerString(), '|', Operator.Minus, '|', Operator.MultiplyBy.toLexerString(), '|', Operator.DividedBy]
    );

    static Operator = new Lexer<Operator>(
        'Operator',
        [CalculationLexers.ComparisonOperator, '|', CalculationLexers.CalculationOperator, '|', Operator.And, '|', Operator.Or.toLexerString()],
        node => {
            if (node[0].Expression) {
                return node[0].Expression;
            };

            if (node[1].Expression) {
                return node[1].Expression;
            }

            return node.Value;
        });

    static OperatorPriorities: StringDictionary<number> = {
        [Operator.Prior]: 0,
        [Operator.Is]: -1,
        [Operator.Not]: -2,
        [Operator.MultiplyBy]: -3,
        [Operator.DividedBy]: -3,
        [Operator.Plus]: -4,
        [Operator.Minus]: -5,
        [Operator.EqualTo]: -6,
        [Operator.NotEqualTo]: -6,
        [Operator.GreaterThan]: -6,
        [Operator.LessThan]: -6,
        [Operator.NoGreaterThan]: -6,
        [Operator.NoLessThan]: -6,
        [Operator.And]: -7,
        [Operator.Or]: -8
    }

    static Calculation: Lexer<CalculationExpression> = new Lexer<CalculationExpression>(
        'Calculation',
        [
            BasicLexers.Value,
            '|', Operator.Not, BasicLexers.CodeBreak, () => CalculationLexers.Calculation,
            '|', '('.toLexerString(), BasicLexers.CodeBreak, () => CalculationLexers.Calculation, BasicLexers.CodeBreak, ')'.toLexerString(),
            '|', BasicLexers.SelectField,
            '|', () => CalculationLexers.Calculation, BasicLexers.CodeBreak, CalculationLexers.Operator, BasicLexers.CodeBreak, () => CalculationLexers.Calculation,
        ],
        node => {
            if (node[0].Expression !== undefined) {
                return {
                    Operator: Operator.Is,
                    Left: node[0].Expression
                }
            }

            if (node[2].Expression !== undefined) {
                let notPriority = CalculationLexers.OperatorPriorities[Operator.Not];
                let notOperator = Operator.Not;
                let top: CalculationExpression = {
                    Operator: notOperator,
                    Left: node[2].Expression
                };
                let mid = top;

                while (CalculationLexers.OperatorPriorities[(mid.Left as CalculationExpression).Operator] <= notPriority) {
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
                    Operator: Operator.Prior,
                    Left: node[4].Expression
                };
            }

            if (node[6].Expression != undefined) {
                return {
                    Operator: Operator.Is,
                    Left: node[6].Expression
                }
            }

            let left = node[7].Expression;
            let right = node[11].Expression;
            let mid;
            let operator = node[9].Expression;
            let leftPriority = CalculationLexers.OperatorPriorities[left.Operator];
            let midPriority = CalculationLexers.OperatorPriorities[operator];
            let rightPriority = CalculationLexers.OperatorPriorities[right.Operator];

            if (leftPriority >= midPriority) {
                mid = {
                    Operator: operator,
                    Left: left,
                    Right: right.Left
                };
            } else {
                mid = {
                    Operator: left.Operator,
                    Left: left.Left,
                    Right: {
                        Operator: operator,
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
