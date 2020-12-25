import { CalculationOperator } from "../enums/operators/calculation-operator";
import { ComparisonOperator } from "../enums/operators/comparison-operator";
import { ConditionOperator } from "../enums/operators/condition-operator";
import { BasicLexers } from "./basic-lexers";
import { CalculationExpression } from "./expressions/calculation-expression";
import { OperatorExpression } from "./expressions/operator-expression";
import { Lexer } from "./lexers/lexer";
import { StringLexer } from "./lexers/string-lexer";

export class CalculationLexers {
    static ComparisonOperator = new StringLexer(
        'ComparisonOperator',
        [ComparisonOperator.EqualTo, '|', ComparisonOperator.NotEqualTo, '|', ComparisonOperator.GreaterThan, '|', ComparisonOperator.NoLessThan, '|', ComparisonOperator.LessThan, '|', ComparisonOperator.NoGreaterThan]);

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

    static Calculation: Lexer<CalculationExpression> = new Lexer<CalculationExpression>(
        'Calculation',
        [
            BasicLexers.Value,
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
                return {
                    Operator: {
                        Type: 'Condition',
                        Operator: ConditionOperator.Prior
                    },
                    Left: node[2].Expression
                };
            }

            if (node[4].Expression != undefined) {
                return {
                    Operator: {
                        Type: 'Condition',
                        Operator: ConditionOperator.Is
                    },
                    Left: node[4].Expression
                }
            }

            return {
                Operator: node[7].Expression,
                Left: node[5].Expression,
                Right: node[9].Expression
            };
        });
}
