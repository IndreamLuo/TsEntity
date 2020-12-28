import { CalculationOperator } from "../../../utilities/enums/operators/calculation-operator";
import { ComparisonOperator } from "../../../utilities/enums/operators/comparison-operator";
import { ConditionOperator } from "../../../utilities/enums/operators/condition-operator";
import { BasicLexers } from "../../../utilities/lexer/basic-lexers";
import { CalculationLexers } from "../../../utilities/lexer/calculation-lexers";
import { CalculationExpression } from "../../../utilities/lexer/expressions/calculation-expression";
import { SelectFieldExpression } from "../../../utilities/lexer/expressions/select-field-expression";
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
        [boolean1, boolean2, boolean3, number1, number2, number3, number4, number7, string1, string2, string3]
            .forEach(value => values1.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));
        let values2: string[] = [];
        [number5, number6, string4, string5]
            .forEach(value => values2.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));

        AssertLexer.CanParse(CalculationLexers.Calculation, boolean1, boolean2).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Is);
            Assert.AreEqual(result.Script, '' + result.Parse.Expression!.Left);
        });
        AssertLexer.CanParse(CalculationLexers.Calculation, boolean3).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Condition');
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Is);
            Assert.AreEqual(result.Script, (result.Parse.Expression!.Left as SelectFieldExpression).Identifier);
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
        AssertLexer.CannotParse(CalculationLexers.Calculation, number5, number6, number7, string4, string5);
        
        Assert.IsTrue(values1.length);
        AssertLexer.CanParse(CalculationLexers.Calculation, ...values1).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Prior);
            Assert.AreEqual((result.Parse.Expression!.Left as CalculationExpression).Operator.Type, 'Condition');
            Assert.AreEqual((result.Parse.Expression!.Left as CalculationExpression).Operator.Operator, ConditionOperator.Is);
        });
        Assert.IsTrue(values2.length);
        AssertLexer.CannotParse(CalculationLexers.Calculation, ...values2);
    }

    @test()
    ParseSelectFieldScripts() {
        let empty = '';
        let codeBreaks = ' \t\r\n \r\t\n';
        let a_ = 'a_';
        let a1_ = 'a1_';
        let numA = '1a';
        let selectFields1 = 'a.b';
        let selectFields2 = `${a1_}${codeBreaks}.${a_}`;
        let wrongSelectFields = `${numA}${codeBreaks}.${a_}`;
        let values1: string[] = [];
        [selectFields1, selectFields2]
            .forEach(value => values1.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));
        let values2: string[] = [];
        [wrongSelectFields, empty]
            .forEach(value => values2.push(`(${value})`, `(${codeBreaks}${value})`, `(${value}${codeBreaks})`, `(${codeBreaks}${value}${codeBreaks})`));

        AssertLexer.CanParse(CalculationLexers.Calculation, selectFields1, selectFields2).forEach(result => {
            Assert.AreEqual(
                `${(result.Parse.Expression!.Left as SelectFieldExpression).Identifier}.${(result.Parse.Expression!.Left as SelectFieldExpression).Field}`,
                result.Script.replace(codeBreaks, '')
            );
        });
        AssertLexer.CannotParse(CalculationLexers.Calculation, wrongSelectFields, empty);

        AssertLexer.CanParse(CalculationLexers.Calculation, ...values1).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Operator, ConditionOperator.Prior);
            Assert.AreEqual((result.Parse.Expression!.Left as CalculationExpression).Operator.Type, 'Condition');
            Assert.AreEqual((result.Parse.Expression!.Left as CalculationExpression).Operator.Operator, ConditionOperator.Is);
        });
        AssertLexer.CannotParse(CalculationLexers.Calculation, ...values2);
    }

    @test()
    ParseConditionScripts() {
        let condition1 = 'a.b == 1';
        let condition2 = '1 <= a.b';
        let condition3 = 'a.b < 1';
        let condition4 = '!true';
        let condition5 = 'a && b + c * !d';
        let condition6 = '!my.dear.girl > 18';
        let condition7 = 'hello.world == true || !my.dear.girl > 18';
        let condition8 = '(a).b == 1 || !(a.b.c + 1) == 0 && a.c.d <= 5';

        AssertLexer.CanParse(CalculationLexers.Calculation, condition1, condition2, condition3).forEach(result => {
            Assert.AreEqual(result.Parse.Expression!.Operator.Type, 'Comparison');
            Assert.IsTrue(result.Parse.Expression!.Operator.Operator);
            Assert.IsTrue(result.Parse.Expression!.Left);
            Assert.IsTrue(result.Parse.Expression!.Right);
        });

        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition1, {
            Operator: {
                Type: 'Comparison',
                Operator: ComparisonOperator.EqualTo
            },
            Left: {
                Operator: {
                    Type: 'Condition',
                    Operator: ConditionOperator.Is
                },
                Left: {
                    Identifier: 'a',
                    Field: 'b'
                }
            },
            Right: {
                Operator: {
                    Type: 'Condition',
                    Operator: ConditionOperator.Is
                },
                Left: 1
            }
        });

        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition4, {
            Operator: {
                Type: 'Condition',
                Operator: ConditionOperator.Not
            },
            Left: {
                Operator: {
                    Type: 'Condition',
                    Operator: ConditionOperator.Is
                },
                Left: true
            }
        });

        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition5, {
            Operator: { Operator: ConditionOperator.And },
            Left: {
                Operator: { Operator: ConditionOperator.Is },
                Left: { Identifier: 'a' }
            },
            Right: {
                Operator: { Operator: CalculationOperator.Plus },
                Left: {
                    Operator: { Operator: ConditionOperator.Is },
                    Left: { Identifier: 'b' }
                },
                Right: {
                    Operator: { Operator: CalculationOperator.MultiplyBy },
                    Left: {
                        Operator: { Operator: ConditionOperator.Is },
                        Left: { Identifier: 'c' }
                    },
                    Right: {
                        Operator: { Operator: ConditionOperator.Not },
                        Left: {
                            Operator: {
                                Operator: ConditionOperator.Is
                            },
                            Left: { Identifier: 'd' }
                        }
                    }
                }
            }
        });
        
        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition6, {
            Operator: { Operator: ComparisonOperator.GreaterThan },
            Left: {
                Operator: { Operator: ConditionOperator.Not },
                Left: {
                    Operator: { Operator: ConditionOperator.Is },
                    Left: {
                        Identifier: {
                            Identifier: 'my',
                            Field: 'dear'
                        },
                        Field: 'girl'
                    }
                }
            },
            Right: {
                Operator: { Operator: ConditionOperator.Is },
                Left: 18
            }
        });
        
        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition7, {
            Operator: { Operator: ConditionOperator.Or },
            Left: {
                Operator: { Operator: ComparisonOperator.EqualTo },
                Left: {
                    Operator: { Operator: ConditionOperator.Is },
                    Left: { Identifier: 'hello', Field: 'world' }
                },
                Right: {
                    Operator: { Operator: ConditionOperator.Is },
                    Left: true
                }
            },
            Right: {
                Operator: { Operator: ComparisonOperator.GreaterThan },
                Left: {
                    Operator: { Operator: ConditionOperator.Not },
                    Left: {
                        Operator: { Operator: ConditionOperator.Is },
                        Left: {
                            Identifier: {
                                Identifier: 'my',
                                Field: 'dear'
                            },
                            Field: 'girl'
                        }
                    }
                },
                Right: {
                    Operator: { Operator: ConditionOperator.Is },
                    Left: 18
                }
            }
        });

        // '(a).b == 1 || !(a.b.c + 1) == 0 && a.c.d <= 5'
        AssertLexer.IsParsedAs(CalculationLexers.Calculation, condition8, {
            Operator: { Operator: ConditionOperator.Or },
            Left: {
                Operator: { Operator: ComparisonOperator.EqualTo },
                Left: {
                    Left: {
                        Identifier: 'a',
                        Field: 'b'
                    }
                },
                Right: { Left: 1 }
            },
            Right: {
                Operator: { Operator: ConditionOperator.And },
                Left: {
                    Operator: { Operator: ComparisonOperator.EqualTo },
                    Left: {
                        Operator: { Operator: ConditionOperator.Not },
                        Left: {
                            Operator: { Operator: ConditionOperator.Prior },
                            Left: {
                                Operator: { Operator: CalculationOperator.Plus },
                                Left: { Left: { Identifier: { Identifier: 'a', Field: 'b' }, Field: 'c' } },
                                Right: { Left: 1 }
                            }
                        }
                    },
                    Right: { Left: 0 }
                },
                Right: {
                    Operator: { Operator: ComparisonOperator.NoGreaterThan },
                    Left: { Left: { Identifier: { Identifier: 'a', Field: 'c' }, Field: 'd' } },
                    Right: { Left: 5 }
                }
            }
        });
    }
}