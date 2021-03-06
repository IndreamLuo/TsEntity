import { ExpressionTreeNode } from "../expression-tree-node";
import { Lexer } from "./lexer";

export class StringLexer extends Lexer<string> {
    constructor (
        name: string,
        subLexers: (string | Lexer<any> | (() => Lexer<any>))[] | string,
        generateExpressionForNode: (node: ExpressionTreeNode<string>) => string = node => node.Value!
    ) {
        super(name, subLexers, generateExpressionForNode);
    }
}