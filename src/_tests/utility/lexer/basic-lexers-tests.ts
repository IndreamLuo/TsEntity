import { BasicLexers } from "../../../utilities/lexer/basic-lexers";
import { test, tests } from "../../framework/decorators";
import { AssertLexer } from "./assert-lexer";

@tests()
export class BasicLexerTests {
    @test()
    ParseScriptsOnSimpleLexers() {
        let empty = '';
        let codeBreaks = ' \t\r\n \t\r\n';
        let a = 'a';
        let a_ = 'a_';
        let a1_ = 'a1_';
        let numA = '1a';
        let selectFields1 = 'a.b';
        let selectFields2 = `${a1_}${codeBreaks}.${a_}`;
        let wrongSelectFields = `${numA}${codeBreaks}.${a_}`;

        AssertLexer.CanParse(BasicLexers.Empty, empty);
        AssertLexer.CannotParse(BasicLexers.Empty, a, codeBreaks, selectFields1);

        AssertLexer.CanParse(BasicLexers.CodeBreak, codeBreaks, empty);
        AssertLexer.CannotParse(BasicLexers.CodeBreak, a);
        
        AssertLexer.CanParse(BasicLexers.Identifier, a, a_, a1_);
        AssertLexer.CannotParse(BasicLexers.Identifier, numA, selectFields1);
        
        AssertLexer.CanParse(BasicLexers.SelectField, selectFields1, selectFields2);
        AssertLexer.CannotParse(BasicLexers.SelectField, wrongSelectFields, a, empty)
    }
}