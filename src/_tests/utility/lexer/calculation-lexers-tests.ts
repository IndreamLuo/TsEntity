import { CalculationOperator } from "../../../utilities/enums/operators/calculation-operator";
import { ComparisonOperator } from "../../../utilities/enums/operators/comparison-operator";
import { ConditionOperator } from "../../../utilities/enums/operators/condition-operator";
import { BasicLexers } from "../../../utilities/lexer/basic-lexers";
import { CalculationLexers } from "../../../utilities/lexer/calculation-lexers";
import { Assert } from "../../_framework/assert";
import { test, tests } from "../../_framework/decorators";
import { AssertLexer } from "./assert-lexer";

@tests()
export class CalculationLexersTests {
    @test()
    ParseOperatorScripts() {
        let comparisonOperators: string[] = Object.values(ComparisonOperator);
        let calculationOperators: string[] = Object.values(CalculationOperator);
        let conditionOperators: string[] = [ConditionOperator.And, ConditionOperator.Or];
        let otherOperators = ['a', '++', '&&&', '%'];

        AssertLexer.CanParse(CalculationLexers.ComparisonOperator, ...comparisonOperators).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Script);
        });
        AssertLexer.CanParse(CalculationLexers.Operator, ...comparisonOperators).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Type, 'Comparison');
            Assert.AreEqual(result.Parse.Expression!.Operator, result.Script);
        });
        AssertLexer.CannotParse(CalculationLexers.ComparisonOperator, ...calculationOperators);
        AssertLexer.CannotParse(CalculationLexers.ComparisonOperator, ...conditionOperators);
        AssertLexer.CannotParse(CalculationLexers.ComparisonOperator, ...otherOperators);
        
        AssertLexer.CanParse(CalculationLexers.CalculationOperator, ...calculationOperators).forEach(result => {
            Assert.AreEqual(result.Parse.Expression, result.Script);
        });
        AssertLexer.CanParse(CalculationLexers.Operator, ...calculationOperators).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Type, 'Calculation');
            Assert.AreEqual(result.Parse.Expression!.Operator, result.Script);
        });
        AssertLexer.CannotParse(CalculationLexers.CalculationOperator, ...comparisonOperators);
        AssertLexer.CannotParse(CalculationLexers.CalculationOperator, ...conditionOperators);
        AssertLexer.CannotParse(CalculationLexers.CalculationOperator, ...otherOperators);
        
        AssertLexer.CanParse(CalculationLexers.Operator, ...conditionOperators).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator, result.Script);
        });
        AssertLexer.CannotParse(CalculationLexers.Operator, ...otherOperators);
    }

    @test()
    ParseValueScripts() {
        let codeBreaks = ' \t\r\n \r\t\n';
        let boolean1 = 'true';
        let boolean2 = 'false';
        let boolean3 = 'True';
        let number1 = '123';
        let number2 = '0';
        let number3 = '-456.0';
        let number4 = '+ 789.123';
        let number5 = '0123';
        let number6 = '123.';
        let number7 = ' 123';
        let string1 = `"abc"`;
        let string2 = `'def\'a'`;
        let string3 = `''`;
        let string4 = `'abc\'"`;
        let string5 = `"abc'`;
        let values1: string[] = [];
        [boolean1, boolean2, number1, number2, number3, number4, string1, string2, string3]
            .forEach(value => values1.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));
        let values2: string[] = [];
        [boolean3, number5, number6, number7, string4, string5]
            .forEach(value => values2.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));

        AssertLexer.CanParse(CalculationLexers.Calculation, boolean1, boolean2).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Is);
            Assert.AreEqual(result.Script, '' + result.Parse.Expression!.Left);
        });
        AssertLexer.CanParse(CalculationLexers.Calculation, number1, number2, number3, number4).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Is);
            Assert.AreEqual(parseFloat(result.Script.replace(BasicLexers.CodeBreak.RegExpForGlobalSearch, '')), result.Parse.Expression!.Left);
        });
        AssertLexer.CanParse(CalculationLexers.Calculation, string1, string2, string3).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Is);
            Assert.AreEqual(result.Script.substring(1, result.Script.length - 2), result.Parse.Expression!.Left);
        });
        AssertLexer.CannotParse(CalculationLexers.Calculation, boolean3, number5, number6, number7, string4, string5);
        
        Assert.IsTrue(values1.length);
        AssertLexer.CanParse(CalculationLexers.Calculation, ...values1).forEach(result => {
            Assert.AreNotEqual(result.Parse.Expression, undefined);
        });
        Assert.IsTrue(values2.length);
        AssertLexer.CannotParse(CalculationLexers.Calculation, ...values2);
    }
}