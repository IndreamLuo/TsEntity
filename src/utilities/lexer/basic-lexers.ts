import { SelectFieldExpression } from "./expressions.ts/SelectFieldExpression";
import { Lexer } from "./lexers/lexer";
import { StringLexer } from "./lexers/string-lexer";

export class BasicLexers {
    static Empty = new StringLexer('Empty', '');
    static CodeBreak = new StringLexer('CodeBreak', '[\\s\\t\\r\\n]*');
    static Identifier = new StringLexer('Identifier', '\\b[a-zA-z_]\\w*\\b');
    static SelectField = new Lexer<SelectFieldExpression>(
        'SelectField',
        [BasicLexers.Identifier, BasicLexers.CodeBreak, '.', BasicLexers.Identifier],
        node => ({
            Identifier: node[0].Expression,
            Field: node[2].Expression
        })
    );
};
