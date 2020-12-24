import { CalculationOperator } from "../enums/operators/calculation-operator";
import { SelectFieldExpression } from "./expressions/select-field-expression";
import { BooleanLexer } from "./lexers/boolean-lexer";
import { Lexer } from "./lexers/lexer";
import { NumberLexer } from "./lexers/number-lexer";
import { StringLexer } from "./lexers/string-lexer";

export class BasicLexers {
    static Empty = new StringLexer('Empty', '');
    static CodeBreak = new StringLexer('CodeBreak', '[\\s\\t\\r\\n]*');
    static Digits = new StringLexer('Digits', '[\\d]+');
    static Identifier = new StringLexer('Identifier', '\\b[a-zA-z_]\\w*\\b');

    static BooleanValue = new BooleanLexer('BooleanValue', 'true|false');

    static PlusMinusSign = new Lexer<CalculationOperator>('PlusMinusSign', ['\\+|-'], node => node.Value == '+' ? CalculationOperator.Plus : CalculationOperator.Minus);
    static PlusMinusSignWithCodeBreak = new StringLexer(
        'PlusMinusSignWithCodeBreak',
        [BasicLexers.PlusMinusSign, BasicLexers.CodeBreak],
        node => node[0].Expression
    );
    static IntegerValueWithoutSign = new NumberLexer('IntegerValueWithoutSign', '[1-9][\\d]*|0');
    static IntegerValue = new NumberLexer('IntegerValue', [BasicLexers.PlusMinusSignWithCodeBreak, '?', BasicLexers.IntegerValueWithoutSign]);
    static FractionalPart = new StringLexer('FractionalPart', ['.', BasicLexers.Digits]);
    static FractionalPartOrEmpty = new StringLexer('', [BasicLexers.FractionalPart, '|', BasicLexers.Empty]);
    static NumberValue = new NumberLexer('NumberValue', [BasicLexers.IntegerValue, BasicLexers.FractionalPartOrEmpty]);
    
    static StringValue = new StringLexer('StringValue', `"[\\s\\S]*"|'[\\s\\S]*'`, node => node.Value!.substring(1, node.Value!.length - 2));

    static SelectField = new Lexer<SelectFieldExpression>(
        'SelectField',
        [BasicLexers.Identifier, BasicLexers.CodeBreak, '.', BasicLexers.Identifier],
        node => ({
            Identifier: node[0].Expression,
            Field: node[2].Expression
        })
    );
};
