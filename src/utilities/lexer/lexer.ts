import { NumberDictionary } from "../types/dictionaries";
import { ExpressionTreeNode } from "./expression-tree-node";

export class Lexer {
    constructor (public Name: string, ...subLexers: (string | Lexer | (() => Lexer))[]) {
        this.SubLexers = subLexers;
    }

    Id: number = ++Lexer.IdCounter;
    static IdCounter = 0;

    get RegExp(): RegExp {
        if (!this._regExp) {
            this._regExp = new RegExp(`^${this.GenerateRegExp()}$`);
        }

        return this._regExp;
    }

    private _regExp: RegExp | null = null;

    GenerateRegExp(generatedLexers: NumberDictionary<Boolean> = {}) {
        let regularExpression: string;
        let generated = generatedLexers[this.Id];

        if (generated) {
            regularExpression = '.*';
        } else {
            !generated && (generatedLexers[this.Id] = true);

            regularExpression = this.SubLexers.length === 1 && typeof(this.SubLexers[0]) === "string"
                ? this.SubLexers[0]
                : this.SubLexers.map(getLexer => {
                    if (typeof(getLexer) === "string") {
                        return getLexer;
                    }

                    let lexer: Lexer = typeof(getLexer) === 'function'
                    ? getLexer()
                    : getLexer;
                    
                    let subLexer = lexer.GenerateRegExp(generatedLexers);
                    
                    return subLexer;
                }).join('');
        }

        !generated && (generatedLexers[this.Id] = false);

        return `(${regularExpression})`;
    }

    SubLexers: (string | Lexer | (() => Lexer))[];

    TryParse(script: string): ExpressionTreeNode | false {
        let matches = this.RegExp.exec(script);

        if (!matches || !matches.length || matches.shift() != script) {
            return false;
        }

        return this.ParseMatches(matches);
    }

    Parse(script: string): ExpressionTreeNode {
        let tryParse = this.TryParse(script);

        if (tryParse) {
            return tryParse;
        }

        throw SyntaxError(`Cannot match script:\n${script}\nwith RegExp:\n${this.RegExp.source}`);
    }

    private ParseMatches(matches: RegExpExecArray, parsedLexers: NumberDictionary<Boolean> = {}): ExpressionTreeNode {
        let parsed = parsedLexers[this.Id];
        let match = matches.shift() as string;

        if (parsed) {
            return this.Parse(match);
        }

        !parsed && (parsedLexers[this.Id] = true);

        let expressionTreeNode = new ExpressionTreeNode(this.Name, match);

        if (this.SubLexers.length > 1 || typeof(this.SubLexers[0]) !== 'string') {
            this.SubLexers.forEach(getLexer => {
                if (typeof(getLexer) === 'string') {
                    return;
                }
                
                let lexer: Lexer = typeof(getLexer) === 'function'
                    ? getLexer()
                    : getLexer;

                let parseSubTokens = lexer.ParseMatches(matches, parsedLexers);
                expressionTreeNode.push(parseSubTokens);
            });
        }

        !parsed && (parsedLexers[this.Id] = false);

        return expressionTreeNode;
    }
}