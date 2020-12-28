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
    static FractionalPart = new StringLexer('FractionalPart', ['.'.toLexerString(), BasicLexers.Digits]);
    static FractionalPartOrEmpty = new StringLexer('FractionalPartOrEmpty', [BasicLexers.FractionalPart, '|', BasicLexers.Empty]);
    static NumberValue = new NumberLexer('NumberValue', [BasicLexers.IntegerValue, BasicLexers.FractionalPartOrEmpty]);
    
    static StringValue = new StringLexer('StringValue', `"[\\s\\S]*"|'[\\s\\S]*'`, node => node.Value!.substring(1, node.Value!.length - 2));

    static Value = new Lexer("Value",
        [BasicLexers.BooleanValue, '|', BasicLexers.NumberValue, '|', BasicLexers.StringValue],
        node => node.filter(subNode => subNode.Expression !== undefined)[0].Expression
    );

    static SelectField: Lexer<SelectFieldExpression> = new Lexer<SelectFieldExpression>(
        'SelectField',
        [
            BasicLexers.Identifier,
            '|', '('.toLexerString(), BasicLexers.CodeBreak, () => BasicLexers.SelectField, BasicLexers.CodeBreak, ')'.toLexerString(),
            '|', () => BasicLexers.SelectField, BasicLexers.CodeBreak, '.'.toLexerString(), BasicLexers.Identifier
        ],
        node => {
            if (node[0].Expression !== undefined) {
                return { Identifier: node[0].Expression };
            }

            if (node[2].Expression !== undefined) {
                return node[2].Expression;
            }
            
            return {
                Identifier: node[4].Expression.Field === undefined ? node[4].Expression.Identifier : node[4].Expression,
                Field: node[6].Expression
            }
        }
    );
};
