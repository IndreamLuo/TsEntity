import { BasicLexers } from "../../../utilities/lexer/basic-lexers";
import { Assert } from "../../_framework/assert";
import { test, tests } from "../../_framework/decorators";
import { AssertLexer } from "./assert-lexer";

@tests()
export class BasicLexerTests {
    @test()
    ParseScriptsOnBasics() {
        let empty = '';
        let space = ' ';
        let codeBreaks = ' \t\r\n \r\t\n';
        let a = 'a';
        let a_ = 'a_';
        let a1_ = 'a1_';
        let numA = '1a';
        let selectFields1 = 'a.b';
        let digits1 = '1234567890';
        let digits2 = '0123456789';
        let digits3 = '0';
        let digits4 = '11';

        AssertLexer.CanParse(BasicLexers.Empty, empty).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Script);
            Assert.AreEqual('', result.Parse.Expression);
        });
        AssertLexer.CannotParse(BasicLexers.Empty, space, a, codeBreaks, selectFields1);

        AssertLexer.CanParse(BasicLexers.CodeBreak, codeBreaks, empty, space).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Script);
        });
        AssertLexer.CannotParse(BasicLexers.CodeBreak, a);
        
        AssertLexer.CanParse(BasicLexers.Identifier, a, a_, a1_).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Script);
        });
        AssertLexer.CannotParse(BasicLexers.Identifier, numA, selectFields1).forEach(result => {
            Assert.AreEqual(result.Error.message, `Cannot match script:"${result.Script}" with RegExp:\\${BasicLexers.Identifier.RegExp.source}\\`);
        });

        AssertLexer.CanParse(BasicLexers.Digits, digits1, digits2, digits3, digits4);
        AssertLexer.CannotParse(BasicLexers.Digits, digits1 + '.', numA);
    }

    @test()
    ParseScriptOnValues() {
        let empty = '';
        let space = ' ';
        let codeBreaks = ' \t\r\n \r\t\n';
        let boolean1 = 'true';
        let boolean2 = 'false';
        let boolean3 = 'True';
        let plusMinusSign1 = '+';
        let plusMinusSign2 = '-';
        let plusMinusSign3 = `-${codeBreaks}`;
        let integer1 = '123';
        let integer2 = '+123';
        let integer3 = '- 123';
        let integer4 = '0123';
        let integer5 = '++123';
        let fractionalPart1 = '.0123';
        let fractionalPart2 = '.1';
        let fractionalPart3 = '.123';
        let fractionalPart4 = '.00';
        let fractionalPart5 = '.';
        let fractionalPart6 = ' .123';
        let fractionalPart7 = '.123 ';
        let numbers1: string[] = [];
        [integer1, integer2, integer3]
            .map(integer => [fractionalPart1, fractionalPart2, fractionalPart3, fractionalPart4, empty].map(fractionPart => `${integer}${fractionPart}`))
            .forEach(array => numbers1 = numbers1.concat(array));
        let numbers2: string[] = [];
        [integer4, integer5]
            .map(integer => [fractionalPart1, fractionalPart2, fractionalPart3, fractionalPart4, empty].map(fractionPart => `${integer}${fractionPart}`))
            .forEach(array => numbers2 = numbers2.concat(array));
        [integer1, integer2, integer3]
            .map(integer => [fractionalPart5, fractionalPart6, fractionalPart7].map(fractionPart => `${integer}${fractionPart}`))
            .forEach(array => numbers2 = numbers2.concat(array));
        let stringValue1 = `'123'`;
        let stringValue2 = `"abc"`;
        let stringValue3 = `''`;
        let stringValue4 = `'"`;

        AssertLexer.CanParse(BasicLexers.BooleanValue, boolean1, boolean2).forEach(result => {
            Assert.AreEqual(result.Script, '' + result.Parse.Expression);
        });
        AssertLexer.CannotParse(BasicLexers.BooleanValue, boolean3);

        AssertLexer.CanParse(BasicLexers.PlusMinusSign, plusMinusSign1, plusMinusSign2);
        AssertLexer.CannotParse(BasicLexers.PlusMinusSign, plusMinusSign3, empty, space);

        AssertLexer.CanParse(BasicLexers.PlusMinusSignWithCodeBreak, plusMinusSign1, plusMinusSign2, plusMinusSign3);
        AssertLexer.CannotParse(BasicLexers.PlusMinusSignWithCodeBreak, empty, space);

        AssertLexer.CanParse(BasicLexers.IntegerValueWithoutSign, integer1);
        AssertLexer.CannotParse(BasicLexers.IntegerValueWithoutSign, integer2, integer3, integer4, integer5);

        AssertLexer.CanParse(BasicLexers.IntegerValue, integer1, integer2, integer3);
        AssertLexer.CannotParse(BasicLexers.IntegerValue, integer4, integer5);

        AssertLexer.CanParse(BasicLexers.FractionalPart, fractionalPart1, fractionalPart2, fractionalPart3, fractionalPart4);
        AssertLexer.CannotParse(BasicLexers.FractionalPart, fractionalPart5, fractionalPart6, fractionalPart7, empty, integer1);

        AssertLexer.CanParse(BasicLexers.FractionalPartOrEmpty, fractionalPart1, fractionalPart2, fractionalPart3, fractionalPart4, empty);
        AssertLexer.CannotParse(BasicLexers.FractionalPart, fractionalPart5, fractionalPart6, fractionalPart7, integer1);

        AssertLexer.CanParse(BasicLexers.NumberValue, ...numbers1).forEach(result => {
            Assert.AreEqual(parseFloat(result.Script.replace(BasicLexers.CodeBreak.RegExpForGlobalSearch, '')), result.Parse.Expression);
        });
        AssertLexer.CannotParse(BasicLexers.NumberValue, ...numbers2);

        AssertLexer.CanParse(BasicLexers.StringValue, stringValue1, stringValue2, stringValue3);
        AssertLexer.CannotParse(BasicLexers.StringValue, stringValue4, integer1, empty);

        AssertLexer.CanParse(BasicLexers.Value, boolean1, boolean2).forEach(result => {
            Assert.AreEqual(result.Script, '' + result.Parse.Expression);
        });
        AssertLexer.CanParse(BasicLexers.Value, ...numbers1).forEach(result => {
            Assert.AreEqual(parseFloat(result.Script.replace(BasicLexers.CodeBreak.RegExpForGlobalSearch, '')), result.Parse.Expression);
        });
        AssertLexer.CanParse(BasicLexers.Value, stringValue1, stringValue2, stringValue3).forEach(result => {
            Assert.AreEqual(result.Script.substring(1, result.Script.length - 2), result.Parse.Expression);
        });
    }

    @test()
    ParseScriptsOnSelectField() {
        let empty = '';
        let codeBreaks = ' \t\r\n \r\t\n';
        let a = 'a';
        let a_ = 'a_';
        let a1_ = 'a1_';
        let numA = '1a';
        let selectFields1 = 'a.b';
        let selectFields2 = `${a1_}${codeBreaks}.${a_}`;
        let wrongSelectFields = `${numA}${codeBreaks}.${a_}`;

        AssertLexer.CanParse(BasicLexers.SelectField, selectFields1, selectFields2).forEach(result => {
            Assert.AreEqual(
                `${result.Parse.Expression!.Identifier}.${result.Parse.Expression!.Field}`,
                result.Script.replace(codeBreaks, '')
            );
        });
        AssertLexer.CannotParse(BasicLexers.SelectField, wrongSelectFields, a, empty);
    }
}