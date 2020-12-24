import { BasicLexers } from "../../../utilities/lexer/basic-lexers";
import { Assert } from "../../_framework/assert";
import { test, tests } from "../../_framework/decorators";
import { AssertLexer } from "./assert-lexer";

@tests()
export class BasicLexerTests {
    @test()
    ParseScripts() {
        let empty = '';
        let space = ' ';
        let codeBreaks = ' \t\r\n \r\t\n';
        let a = 'a';
        let a_ = 'a_';
        let a1_ = 'a1_';
        let numA = '1a';
        let selectFields1 = 'a.b';
        let selectFields2 = `${a1_}${codeBreaks}.${a_}`;
        let wrongSelectFields = `${numA}${codeBreaks}.${a_}`;

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
        });;
        
        AssertLexer.CanParse(BasicLexers.SelectField, selectFields1, selectFields2).forEach(result => {
            Assert.AreEqual(
                `${result.Parse.Expression!.Identifier}.${result.Parse.Expression!.Field}`,
                result.Script.replace(codeBreaks, '')
            );
        });
        AssertLexer.CannotParse(BasicLexers.SelectField, wrongSelectFields, a, empty);
    }
}