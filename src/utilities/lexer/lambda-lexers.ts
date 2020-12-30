import { Assure } from "../assure";
import { BasicLexers } from "./basic-lexers";
import { CalculationLexers } from "./calculation-lexers";
import { CalculationExpression } from "./expressions/calculation-expression";
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
        });

    static CalculationLambda = new Lexer<LambdaExpression<CalculationExpression>>(
        "CalculationLambda",
        [LambdaLexers.LambdaParameters, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, CalculationLexers.Calculation],
        node => ({
            Parameters: node[0].Expression,
            Expression: node[3].Expression
        })
    )
}
