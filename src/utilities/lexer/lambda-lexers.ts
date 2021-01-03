import { Assure } from "../assure";
import { Operator } from "../types/operators";
import { BasicLexers } from "./basic-lexers";
import { CalculationLexers } from "./calculation-lexers";
import { CalculationExpression } from "./expressions/calculation-expression";
import { KeyPairingExpression } from "./expressions/key-pairing-expression";
import { LambdaExpression } from "./expressions/lambda-expression";
import { SelectFieldExpression } from "./expressions/select-field-expression";
import { Lexer } from "./lexers/lexer";

export class LambdaLexers {
    static ExtraParameter = new Lexer<string>(
        "ExtraParameter",
        [BasicLexers.CodeBreak, ',', BasicLexers.CodeBreak, BasicLexers.Identifier],
        node => node[2].Expression
    );

    static ExtraParameters: Lexer<string[]> = new Lexer(
        "ExtraParameters",
        [LambdaLexers.ExtraParameter, '*'],
        node => {
            let expression = node.map(subNode => subNode.Expression!);

            expression.forEach((item1, index1) => {
                expression.forEach((item2, index2) => {
                    index1 != index2 && Assure.AreNotEqual(item1, item2, () => `Replicated parameter [${item1}].`);
                });
            });

            return expression;
        });

    static Parameters = new Lexer<string[]>(
        "Parameters",
        [BasicLexers.Identifier, LambdaLexers.ExtraParameters],
        node => {
            Assure.IsNotIn(node[0].Expression, node[1].Expression, () => `Replicated parameter [${node[0].Expression}].`);

            return [node[0].Expression].concat(node[1].Expression)
        });

    static LambdaParameters = new Lexer<string[]>(
        "LambdaParameters",
        [BasicLexers.Identifier, '|', '('.toLexerString(), BasicLexers.CodeBreak, LambdaLexers.Parameters, BasicLexers.CodeBreak, ')'.toLexerString()],
        node => node[0].Expression !== undefined
            ? [node[0].Expression]
            : node[2].Expression
    );

    static SelectFieldLambda = new Lexer<LambdaExpression<SelectFieldExpression>>(
        "SelectField",
        [LambdaLexers.LambdaParameters, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, BasicLexers.SelectField],
        node => {
            let identifier = node[3].Expression.Identifier;
            while (typeof(identifier) === 'object') {
                identifier = identifier.Identifier;
            }

            Assure.AreEqual(
                node[0].Expression[0],
                identifier,
                () => `"${node[0].Expression}" and "${node[3].Expression.Identifier}" are not equal. A select-field lambda should be using the parameter input.`);

            return {
                Parameters: node[0].Expression,
                Expression: node[3].Expression
            }
        }
    );

    static CalculationLambda = new Lexer<LambdaExpression<CalculationExpression>>(
        "CalculationLambda",
        [LambdaLexers.LambdaParameters, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, CalculationLexers.Calculation],
        node => ({
            Parameters: node[0].Expression,
            Expression: node[3].Expression
        })
    )

    static PairingPatternLambda = new Lexer<LambdaExpression<KeyPairingExpression[]>>(
        "PairingPatternLambda",
        [LambdaLexers.CalculationLambda],
        node => {
            let calculationLambdaExpression = node[0].Expression! as LambdaExpression<CalculationExpression>;

            let from = calculationLambdaExpression.Parameters[0];
            let to = calculationLambdaExpression.Parameters[0];

            function reduceExpression(calculationExpression: any): any {
                if (calculationExpression === undefined) {
                    return undefined;
                } else if (typeof(calculationExpression) === 'object') {
                    if (typeof(calculationExpression.Operator) === 'string') {
                        let leftExpression = reduceExpression(calculationExpression.Left);
                        let rightExpression = reduceExpression(calculationExpression.Right);

                        switch (calculationExpression.Operator) {
                            case Operator.Is:
                            case Operator.Prior:
                                return leftExpression;
                            case Operator.And:
                            case Operator.EqualTo:
                                return leftExpression.Operator === Operator.EqualTo || leftExpression.Identifier === from
                                    ? {
                                        Operator: calculationExpression.Operator,
                                        Left: leftExpression,
                                        Right: rightExpression
                                    }
                                    : {
                                        Operator: calculationExpression.Operator,
                                        Left: rightExpression,
                                        Right: leftExpression
                                    }
                        }
                    } else if (typeof(calculationExpression.Field) === 'string' && typeof(calculationExpression.Identifier) === 'string') {

                    }
                }

                throw new Error("Expression is not supported as Pairing Pattern Lambda.");
            };

            let reducedExpression = reduceExpression(calculationLambdaExpression.Expression);

            function convertExpressionToPairings(calculationExpression: CalculationExpression, pairings: KeyPairingExpression[]) {
                let leftExpression = calculationExpression.Left;
                let rightExpression = calculationExpression.Right;

                if (calculationExpression.Operator === Operator.And) {
                    convertExpressionToPairings(leftExpression as CalculationExpression, pairings);
                    convertExpressionToPairings(rightExpression as CalculationExpression, pairings);
                }

                let leftSelectField = leftExpression as SelectFieldExpression;
                let rightSelectField = rightExpression as SelectFieldExpression;
                if (leftSelectField.Identifier !== from) {
                    let mid = leftSelectField;
                    leftSelectField = rightSelectField;
                    rightSelectField = mid;
                }

                Assure.AreEqual(leftSelectField.Identifier, from, () => `Pairing doesn't use [${from}].`);

                if (to) {
                    Assure.AreEqual(rightSelectField.Identifier, to, () => `Pairing doesn't use [${to}].`);
                } else {
                    Assure.IsNullOrUndefined(rightSelectField, () => `Unknowned identifier [${rightSelectField.Identifier}]`);
                }

                pairings.push({
                    FromKey: leftSelectField.Field,
                    ToKey: rightSelectField?.Field
                });
            }

            let pairingExpression: KeyPairingExpression[] = [];
            convertExpressionToPairings(reducedExpression, pairingExpression);

            let expression = {
                Parameters: calculationLambdaExpression.Parameters,
                Expression: pairingExpression
            };

            return expression;
        }
    )
}
