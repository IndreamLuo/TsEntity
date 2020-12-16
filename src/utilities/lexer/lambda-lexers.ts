import { Assure } from "../assure";
import { BasicLexers } from "./basic-lexers";
import { SelectFieldExpression } from "./expressions.ts/SelectFieldExpression";
import { Lexer } from "./lexers/lexer";

export class LambdaLexers {
    static ExtraParameter = new Lexer(
        "ExtraParameter",
        [BasicLexers.CodeBreak, ',', BasicLexers.CodeBreak, BasicLexers.Identifier],
        node => {
            node.Expression = node[2].Expression
        }
    );

    static ExtraParameters: Lexer<string[]> = new Lexer(
        "ExtraParameters",
        [BasicLexers.Empty, '|', LambdaLexers.ExtraParameter, () => LambdaLexers.ExtraParameters],
        node => {
            let expression = [];

            if (node[1].Expression) {
                expression.push(node[1].Expression);
            }
            if (node[2].Expression) {
                expression.concat(node[2].Expression);
            }

            return expression;
        });

    static Parameters = new Lexer(
        "Parameters",
        [BasicLexers.Identifier, LambdaLexers.ExtraParameters],
        node => [node[0]].concat(node[1].Expression));

    static SelectFieldWithBrackets: Lexer<SelectFieldExpression> = new Lexer(
        "SelectFieldBody",
        [BasicLexers.SelectField, '|', '(', () => LambdaLexers.SelectFieldWithBrackets, ')'],
        node => node[0].Expression || node[1].Expression);

    static SelectFieldLambda = new Lexer<SelectFieldExpression>(
        "SelectField",
        [BasicLexers.Identifier, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, LambdaLexers.SelectFieldWithBrackets],
        node => {
            Assure.AreEqual(
                node[0].Expression,
                node[3].Expression.Field,
                () => `"${node[0].Expression}" and "${node[3].Expression.Field}" are not equal. A select-field lambda should be using the parameter input.`);

            return node[3].Expression;
        });
}
