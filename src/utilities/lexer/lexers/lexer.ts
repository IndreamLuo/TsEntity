import { Assure } from "../../assure";
import { NumberDictionary } from "../../types/dictionaries";
import { ExpressionTreeNode } from "../expression-tree-node";

require('./to-lexer-string');

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
            let subExpressions = this.SubExpressions;
            let regExpSubExpression: NumberDictionary<RegExp> = {};

            this._regExpForRecursive = new RegExp(
                // The recrusive RegExp should be 100% (no more, no less) matching as the complete RegExp does
                // The first layer will be the almost same as origin and put the recursive sub-lexer (marked as undefined) with a second layer matching
                subExpressions!
                    .map(subExpression => subExpression !== undefined
                            ? subExpression
                            : `(${this.SubExpressions?.map((sub, index) => {
                                if (sub !== undefined) {
                                    return sub;
                                }

                                // RegExp /[\S\s]*/ will be used for recursive only while it's enclosed by non-empty-able sub-lexers.
                                // This design avoids /[\S\s]*/ extends it's coverage outside the recursive area.
                                let previousIndex = index - 1;
                                let frontClosure = false;

                                while (!frontClosure && previousIndex >= 0) {
                                    if (subExpressions![previousIndex] !== undefined) {
                                        let previousLexer = subExpressions![previousIndex];

                                        if (previousLexer!.match(/^(|[\s\S]*[^\\])(\\\\)*\|$/)) {
                                            break;
                                        }

                                        regExpSubExpression[previousIndex] = regExpSubExpression[previousIndex] || new RegExp(`^(${previousLexer})$`);
                                        let match = regExpSubExpression[previousIndex].exec('');
                                        frontClosure = match === null || match!.length === 0;
                                    }

                                    previousIndex--;
                                }

                                if (frontClosure) {
                                    let nextIndex = index + 1;
                                    let behindClosure = false;

                                    while (!behindClosure && nextIndex < subExpressions!.length) {
                                        if (subExpressions![nextIndex] !== undefined) {
                                            let nextLexer = subExpressions![nextIndex];

                                            if (nextLexer![0] === '|') {
                                                break;
                                            }

                                            regExpSubExpression[nextIndex] = regExpSubExpression[nextIndex] || new RegExp(`^(${nextLexer})$`);
                                            let match = regExpSubExpression[nextIndex].exec('');
                                            behindClosure = match === null || match!.length === 0;
                                        }

                                        nextIndex++;
                                    }

                                    if (behindClosure) {
                                        return '[\\S\\s]*';
                                    }
                                }

                                return '';
                            }).join('')})*`)
                    .join('')
            );
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
                    : `(${this.RegExpForRecursive.source})`)
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

                        if (match !== undefined) {
                            let subMatches = [...match.matchAll(new RegExp(lexer.RegExp.source, 'g'))];
                            subMatches.forEach(iterateMatches => {
                                iterateMatches.shift();
                                let parseSubTokens = lexer.ParseMatches(iterateMatches);
                                expressionTreeNode.push(parseSubTokens);
                            });
                        }

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
        [...matchingString.matchAll(/(?<!(?<!(?<=\\)(\\\\)*)\\)\((?<!\?)(?=[\s\S]*\))/g)].forEach(() => {
            matches.shift();
        });
    }
}