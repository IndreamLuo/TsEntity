import { BasicLexers } from "./basic-lexers";
import { Lexer } from "./lexer";

export class LambdaLexers {
    static Parameter = new Lexer("Parameter", BasicLexers.Identifier);
    static ExtraParameter = new Lexer("ExtraParameter", BasicLexers.CodeBreak, ',', BasicLexers.CodeBreak, LambdaLexers.Parameter);
    static ExtraParameters: Lexer = new Lexer("ExtraParameters", BasicLexers.Empty, '|', LambdaLexers.ExtraParameter, () => LambdaLexers.ExtraParameters);
    static Parameters = new Lexer("Parameters", LambdaLexers.Parameter, LambdaLexers.ExtraParameters);
    static SelectFieldWithBrackets: Lexer = new Lexer("SelectFieldBody", BasicLexers.SelectField, '|', '(', () => LambdaLexers.SelectFieldWithBrackets, ')');
    static SelectFieldLambda = new Lexer("SelectField", LambdaLexers.Parameter, BasicLexers.CodeBreak, '=>', BasicLexers.CodeBreak, LambdaLexers.SelectFieldWithBrackets);
}
