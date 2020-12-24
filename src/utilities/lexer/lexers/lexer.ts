import { Assure } from "../../assure";
import { NumberDictionary } from "../../types/dictionaries";
import { ExpressionTreeNode } from "../expression-tree-node";

export class Lexer<T> {
    constructor (
        public Name: string,
        public SubLexers: (string | Lexer<any> | (() => Lexer<any>))[] | string,
        public GenerateExpressionForNode: (node: ExpressionTreeNode<T>) => T
    ) {}

    Id: number = ++Lexer.IdCounter;
    static IdCounter = 0;

    get RegExp(): RegExp {
        if (!this._regExp) {
            this._regExp = new RegExp(this.GenerateRegExp()!);
        }

        return this._regExp;
    }

    private _regExp?: RegExp;

    get RegExpWithBorder(): RegExp {
        if (!this._regExpWithBorder) {
            this._regExpWithBorder = new RegExp(`^${this.RegExp.source}$`);
        }

        return this._regExpWithBorder;
    }

    private _regExpWithBorder?: RegExp;

    get RegExpForGlobalSearch(): RegExp {
        if (!this._regExpForGlobalSearch) {
            this._regExpForGlobalSearch = new RegExp(this.RegExp.source, 'g');
        }

        return this._regExpForGlobalSearch;
    }

    private _regExpForGlobalSearch?: RegExp;

    get RegExpForRecursive(): RegExp {
        if (!this._regExpForRecursive) {
            this._regExpForRecursive = new RegExp(`(${this.SubExpressions!.map(subExpression => subExpression !== undefined ? subExpression : '[\\s\\S]*').join('')})`);
        }

        return this._regExpForRecursive;
    }

    private _regExpForRecursive?: RegExp;

    SubExpressions?: (string | undefined)[];

    GenerateRegExp(generatedLexers: NumberDictionary<Boolean> = {}) {
        let generated = generatedLexers[this.Id];

        if (generated) {
            return undefined;
        }
    
        generatedLexers[this.Id] = true;

        let regularExpression: string;

        if (typeof(this.SubLexers) === "string") {
            regularExpression = this.SubLexers;
        } else {
            this.SubExpressions = this.SubExpressions
                || (this.SubLexers as []).map(getLexer => {
                    if (typeof(getLexer) === "string") {
                        return getLexer;
                    }

                    let lexer: Lexer<any> = typeof(getLexer) === 'function'
                    ? (getLexer as Function)()
                    : getLexer;
                    
                    let subLexer = lexer.GenerateRegExp(generatedLexers);
                    
                    return subLexer;
                });

            regularExpression = this.SubExpressions
                .map(expression => expression !== undefined
                    ? expression
                    : `(()|${this.RegExpForRecursive.source})`)
                .join('');
        }
        
        generatedLexers[this.Id] = false;

        return `(${regularExpression})`;
    }

    TryParse(script: string): ExpressionTreeNode<T> | false {
        let matches = this.RegExpWithBorder.exec(script);

        if (!matches || !matches.length || matches.shift() != script) {
            return false;
        }

        let parsed = this.ParseMatches(matches)!;

        Assure.AreEqual(matches.length, 0, () => `Lexer[${this.Name}] should parse all results from script"${script}".`);

        return parsed;
    }

    Parse(script: string): ExpressionTreeNode<T> {
        let tryParse = this.TryParse(script);

        if (tryParse) {
            return tryParse;
        }

        throw SyntaxError(`Cannot match script:"${script}" with RegExp:\\${this.RegExp.source}\\`);
    }

    private ParseMatches(matches: string[], parsedLexers: NumberDictionary<Boolean> = {}): ExpressionTreeNode<T> {
        let parsed = parsedLexers[this.Id];
        let match = matches.shift() as string;

        let expressionTreeNode = new ExpressionTreeNode<T>(this.Name, match);

        if (parsed) {
            this.ClearMatchesByMatchingString(matches, this.RegExpForRecursive.source);

            if (match !== undefined) {
                return this.Parse(match);
            }
        } else {
            parsedLexers[this.Id] = true;

            if (typeof(this.SubLexers) !== 'string') {
                (this.SubLexers as []).forEach((getLexer, index) => {
                    if (typeof(getLexer) === 'string') {
                        this.ClearMatchesByMatchingString(matches, getLexer as string);

                        return;
                    }
                    
                    let lexer: Lexer<T> = typeof(getLexer) === 'function'
                        ? (getLexer as Function)()
                        : getLexer;

                    let nextChar = index + 1 < this.SubLexers.length
                        && typeof(this.SubLexers[index + 1]) === 'string'
                        && ('?+*'.indexOf((this.SubLexers[index + 1] as string)[0]) + 1);
                    
                    if (nextChar) {
                        this.ClearMatchesByMatchingString(matches, lexer.RegExp.source);

                        let subMatches = [...match.matchAll(new RegExp(lexer.RegExp.source, 'g'))];
                        subMatches.forEach(iterateMatches => {
                            iterateMatches.shift();
                            let parseSubTokens = lexer.ParseMatches(iterateMatches);
                            expressionTreeNode.push(parseSubTokens);
                        });

                        return;
                    }

                    let parseSubTokens = lexer.ParseMatches(matches, parsedLexers);
                    expressionTreeNode.push(parseSubTokens);
                });
            } else {
                this.ClearMatchesByMatchingString(matches, this.SubLexers as string);
            }

            match !== undefined
                && (expressionTreeNode.Expression = this.GenerateExpressionForNode(expressionTreeNode));

            parsedLexers[this.Id] = false;
        }

        return expressionTreeNode;
    }

    private ClearMatchesByMatchingString(matches: string[], matchingString: string) {
        [...matchingString.matchAll(/\((?<!\?)(?=[\s\S]*\))/g)].forEach(() => {
            matches.shift();
        });
    }
}