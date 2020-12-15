import { Lexer } from "./lexer";

export class BasicLexers {
    static Empty = new Lexer('Empty', '');
    static CodeBreak = new Lexer('CodeBreak', '[\\s\\t\\r\\n]*');
    static Identifier = new Lexer('Identifier', '\\b[a-zA-z_]\\w*\\b');
    static SelectField = new Lexer('SelectField', BasicLexers.Identifier, BasicLexers.CodeBreak, '.', BasicLexers.Identifier);
};
