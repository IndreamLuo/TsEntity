import { SelectFieldExpression } from "../../../utilities/lexer/expressions/select-field-expression";
import { LambdaLexers } from "../../../utilities/lexer/lambda-lexers";
import { Assert } from "../../_framework/assert";
import { test, tests } from "../../_framework/decorators";
import { AssertLexer } from "./assert-lexer";

tests()
export class LambdaLexersTests {
    @test()
    ParseScriptsOnParameters() {
        let codeBreaks = ' \t\r\n \t\r\n';
        let extraParameter1 = ', b';
        let extraParameter2 = ',b';
        let extraParameter3 = `${codeBreaks},${codeBreaks}c`;
        let extraParameter4 = `,2b`;
        let parameters1 = 'a';
        let parameters2 = 'a' + extraParameter1;
        let parameters3 = parameters2 + extraParameter3;
        let parameters4 = parameters3 + extraParameter4;
        let parameters5 = parameters3 + ',';
        let parameters6 = '2a';

        AssertLexer.CanParse(LambdaLexers.ExtraParameter, extraParameter1, extraParameter2, extraParameter3).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Parse[2]!.Expression);
            Assert.IsTrue(result.Parse.Expression);
        });
        AssertLexer.CannotParse(LambdaLexers.ExtraParameter, extraParameter4);

        AssertLexer.CanParse(LambdaLexers.ExtraParameters, `${codeBreaks}${extraParameter1}${extraParameter3}`).forEach(result => {
            let commas = 0;
            for (let index = 0; index < result.Script.length; index++) {
                result.Script[index] == ',' && commas++;
            }
            Assert.AreEqual(result.Parse.Expression!.length, commas);
            result.Parse.Expression!.forEach((item, index) => {
                result.Parse.Expression!.forEach((secondLoopItem, secondLoopIndex) => {
                    Assert.IsTrue(index === secondLoopIndex || item != secondLoopItem);
                })
            });
        });
        AssertLexer.CannotParse(LambdaLexers.ExtraParameters, `${extraParameter1}${extraParameter2}`).forEach(result => {
            Assert.AreEqual(result.Error.message, 'Replicated parameter [b].');
        });
        AssertLexer.CannotParse(LambdaLexers.ExtraParameters, `${extraParameter1}${extraParameter4}`);

        AssertLexer.CanParse(LambdaLexers.Parameters, parameters1, parameters2, parameters3).forEach(result => {
            let commas = 1;
            for (let index = 0; index < result.Script.length; index++) {
                result.Script[index] == ',' && commas++;
            }
            Assert.AreEqual(result.Parse.Expression!.length, commas);
            result.Parse.Expression!.forEach((item, index) => {
                result.Parse.Expression!.forEach((secondLoopItem, secondLoopIndex) => {
                    Assert.IsTrue(index === secondLoopIndex || item != secondLoopItem);
                })
            });
        });
        AssertLexer.CannotParse(LambdaLexers.Parameters, parameters4, parameters5, parameters6);
    }

    @test()
    ParseScriptsOnSelectFieldWithBrackets() {
        let codeBreaks = ' \t\r\n \t\r\n';
        let selectFieldWithBrackets1 = `a${codeBreaks}.b`;
        let selectFieldWithBrackets2 = '(a.b)';
        let selectFieldWithBrackets3 = `(${codeBreaks}a${codeBreaks}.b${codeBreaks})`;
        let selectFieldWithBrackets4 = '(a.a)';
        let selectFieldWithBrackets5 = `((${codeBreaks}(a.a${codeBreaks})))`;
        let selectFieldWithBrackets6 = 'a';
        let selectFieldWithBrackets7 = 'a.1';
        let selectFieldWithBrackets8 = 'a.a)';
        let selectFieldWithBrackets9 = '(a.a';
        let selectFieldWithBrackets10 = 'a.b.c.d';
        let selectFieldWithBrackets11 = '((a.b).c).d';

        AssertLexer.CannotParse(LambdaLexers.SelectFieldWithBrackets, '1', codeBreaks);
        AssertLexer.CanParse(LambdaLexers.SelectFieldWithBrackets, 'a', 'hello', '_').forEach(result => {
            Assert.AreEqual(result.Script, result.Parse.Expression);
        });
        AssertLexer.CanParse(LambdaLexers.SelectFieldWithBrackets, selectFieldWithBrackets1, selectFieldWithBrackets2, selectFieldWithBrackets3).forEach(result => {
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Identifier, 'a');
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Field, 'b');
        });
        AssertLexer.CanParse(LambdaLexers.SelectFieldWithBrackets, selectFieldWithBrackets4, selectFieldWithBrackets5).forEach(result => {
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Identifier, 'a');
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Field, 'a');
        });
        AssertLexer.CannotParse(LambdaLexers.SelectFieldWithBrackets, selectFieldWithBrackets6, selectFieldWithBrackets7, selectFieldWithBrackets8, selectFieldWithBrackets9);

        AssertLexer.CanParse(LambdaLexers.SelectFieldWithBrackets, selectFieldWithBrackets10, selectFieldWithBrackets11);
    }

    @test()
    ParseScriptsOnSelectFieldLambda() {
        let codeBreaks = ' \t\r\n \t\r\n';
        let selectFieldLambda1 = 'a => a.b';
        let selectFieldLambda2 = 'a=>a.b';
        let selectFieldLambda3 = `a => ( a.b${codeBreaks})`;
        let selectFieldLambda4 = 'a =>';
        let selectFieldLambda5 = 'a=>a=>a.b';
        let selectFieldLambda6 = 'a=>=>a.b';
        let selectFieldLambda7 = 'a=>b.a';

        AssertLexer.CanParse(LambdaLexers.SelectFieldLambda, 'a => a', 'hello=> hello', '_ =>_').forEach(result => {
            Assert.AreEqual(result.Script.substring(0, result.Script.indexOf('=>')).trim(), result.Parse.Expression);
        });
        AssertLexer.CannotParse(LambdaLexers.SelectFieldLambda, '1', codeBreaks);
        AssertLexer.CanParse(LambdaLexers.SelectFieldLambda, selectFieldLambda1, selectFieldLambda2, selectFieldLambda3).forEach(result => {
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Identifier, 'a');
            Assert.AreEqual((result.Parse.Expression as SelectFieldExpression).Field, 'b');
        });
        AssertLexer.CannotParse(LambdaLexers.SelectFieldLambda, selectFieldLambda4, selectFieldLambda5, selectFieldLambda6);
        AssertLexer.CannotParse(LambdaLexers.SelectFieldLambda, selectFieldLambda7).forEach(result => {
            Assert.AreEqual(result.Error.message, '"a" and "b" are not equal. A select-field lambda should be using the parameter input.');
        });
    }
}