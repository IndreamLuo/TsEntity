import { ExpressionTreeNode } from "../../../utilities/lexer/expression-tree-node";
import { Lexer } from "../../../utilities/lexer/lexers/lexer";
import { Assert } from "../../_framework/assert";

export class AssertLexer {
    static CanParse<T>(lexer: Lexer<T>, ...scripts: string[]){
        return scripts.map(script => {
            let parse = lexer.Parse(script);
            AssertLexer.IsParseMatchingWith(parse, lexer);
            return {
                Script: script,
                Parse: parse
            };
        });
    }

    static CannotParse(lexer: Lexer<any>, ...scripts: string[]): { Script: string, Error: Error }[] {
        return scripts.map(script => {
            try {
                lexer.Parse(script);
            } catch (error) {
                return {
                    Script: script,
                    Error: error
                };
            }
            
            throw Error(`Lexer[${lexer.Name}] can parse "${script}".`);
        });
    }

    static IsParseMatchingWith(parse: ExpressionTreeNode<any>, lexer: Lexer<any>) {
        if (typeof(lexer.SubLexers) === 'string') {
            Assert.IsTrue(parse.Value != null && parse.Value != undefined);
            Assert.IsTrue(lexer.RegExpWithBorder.test(parse.Value!));
            Assert.AreEqual(parse.length, 0);
            return;
        }

        let lexerIndex = 0;
        for (let index = 0; index < lexer.SubLexers.length; index++) {
            let getSubLexer = lexer.SubLexers[index];
            
            if (typeof(getSubLexer) !== 'string') {
                let subLexer = typeof(getSubLexer) === 'function'
                    ? getSubLexer()
                    : getSubLexer;

                let nextChar = index + 1 < lexer.SubLexers.length
                    && typeof(lexer.SubLexers[index + 1]) === 'string'
                    && ('?*'.indexOf((lexer.SubLexers[index + 1] as string)[0]) + 1);

                if (nextChar) {
                    if (lexerIndex === parse.length) {
                        return;
                    }

                    if (!subLexer.TryParse(parse[lexerIndex++].Value!)) {
                        index += 2;
                    }
                } else {
                    let subParse = parse[lexerIndex];
                    lexerIndex++;

                    subParse.Expression === undefined || AssertLexer.IsParseMatchingWith(subParse, subLexer);
                }
            }
        }
    }

    static IsParsedAs(lexer: Lexer<any>, script: string, structure: any) {
        let parsed = lexer.Parse(script);
        Assert.HasSameStructure(parsed.Expression, structure);
    }
}