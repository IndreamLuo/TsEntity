import { Assure } from "../assure";
import { BasicLexers } from "./basic-lexers";
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

    static SelectFieldWithBrackets: Lexer<SelectFieldExpression> = new Lexer(
        "SelectFieldWithBrackets",
        [BasicLexers.SelectField, '|', '\\(', BasicLexers.CodeBreak, () => LambdaLexers.SelectFieldWithBrackets, BasicLexers.CodeBreak, '\\)'],
        node => node[0].Expression || node[2].Expression);

    static SelectFieldLambda = new Lexer<SelectFieldExpression>(
        "SelectField",
        [BasicLexers.Identifier, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, LambdaLexers.SelectFieldWithBrackets],
        node => {
            Assure.AreEqual(
                node[0].Expression,
                node[3].Expression.Identifier,
                () => `"${node[0].Expression}" and "${node[3].Expression.Identifier}" are not equal. A select-field lambda should be using the parameter input.`);

            return node[3].Expression;
        });
}
