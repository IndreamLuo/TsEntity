import { NumberDictionary } from "../../types/dictionaries";
import { ExpressionTreeNode } from "../expression-tree-node";

export class Lexer<T> {
    constructor (
        public Name: string,
        public SubLexers: (string | Lexer<any> | (() => Lexer<any>))[] | string,
        public OnExpressionTreeNodeGenerated: (node: ExpressionTreeNode<T>) => T
    ) {}

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

            regularExpression = typeof(this.SubLexers) === "string"
                ? this.SubLexers
                : (this.SubLexers as []).map(getLexer => {
                    if (typeof(getLexer) === "string") {
                        return getLexer;
                    }

                    let lexer: Lexer<any> = typeof(getLexer) === 'function'
                    ? (getLexer as Function)()
                    : getLexer;
                    
                    let subLexer = lexer.GenerateRegExp(generatedLexers);
                    
                    return subLexer;
                }).join('');
        }

        !generated && (generatedLexers[this.Id] = false);

        return `(${regularExpression})`;
    }

    TryParse(script: string): ExpressionTreeNode<T> | false {
        let matches = this.RegExp.exec(script);

        if (!matches || !matches.length || matches.shift() != script) {
            return false;
        }

        let node = this.ParseMatches(matches);

        node.Expression = this.OnExpressionTreeNodeGenerated(node);

        return node;
    }

    Parse(script: string): ExpressionTreeNode<T> {
        let tryParse = this.TryParse(script);

        if (tryParse) {
            return tryParse;
        }

        throw SyntaxError(`Cannot match script:\n${script}\nwith RegExp:\n${this.RegExp.source}`);
    }

    private ParseMatches(matches: RegExpExecArray, parsedLexers: NumberDictionary<Boolean> = {}): ExpressionTreeNode<T> {
        let parsed = parsedLexers[this.Id];
        let match = matches.shift() as string;

        if (parsed) {
            return this.Parse(match);
        }

        !parsed && (parsedLexers[this.Id] = true);

        let expressionTreeNode = new ExpressionTreeNode<T>(this.Name, match);

        if (typeof(this.SubLexers) !== 'string') {
            (this.SubLexers as []).forEach(getLexer => {
                if (typeof(getLexer) === 'string') {
                    return;
                }
                
                let lexer: Lexer<T> = typeof(getLexer) === 'function'
                    ? (getLexer as Function)()
                    : getLexer;

                let parseSubTokens = lexer.ParseMatches(matches, parsedLexers);
                expressionTreeNode.push(parseSubTokens);
            });
        }

        !parsed && (parsedLexers[this.Id] = false);

        return expressionTreeNode;
    }
}