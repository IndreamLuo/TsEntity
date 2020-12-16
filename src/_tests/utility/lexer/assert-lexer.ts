import { ExpressionTreeNode } from "../../../utilities/lexer/expression-tree-node";
import { Lexer } from "../../../utilities/lexer/lexers/lexer";
import { Assert } from "../../framework/assert";

export class AssertLexer {
    static CanParse(lexer: Lexer<any>, ...scripts: string[]){
        scripts.forEach(script => {
            let parse = lexer.Parse(script);
            AssertLexer.IsParseMatches(lexer, parse);
        });
    }

    static CannotParse(lexer: Lexer<any>, ...scripts: string[]) {
        scripts.forEach(script => {
            Assert.IsFalse(lexer.TryParse(script));
        });
    }

    static IsParseMatches(lexer: Lexer<any>, parse: ExpressionTreeNode<any>) {
        if (lexer.SubLexers.length === 1 && typeof(lexer.SubLexers[0]) === 'string') {
            Assert.IsTrue(parse.Value != null && parse.Value != undefined);
            Assert.IsTrue(lexer.RegExp.test(parse.Value as string));
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
                
                let subParse = parse[lexerIndex];
                lexerIndex++;

                AssertLexer.IsParseMatches(subLexer, subParse);
            }
        }
    }
}