import { ExpressionTreeNode } from "../expression-tree-node";
import { Lexer } from "./lexer";

export class BooleanLexer extends Lexer<Boolean> {
    constructor (
        name: string,
        subLexers: (string | Lexer<any> | (() => Lexer<any>))[] | string,
        generateExpressionForNode: (node: ExpressionTreeNode<Boolean>) => Boolean = node => node.Value && true || false
    ) {
        super(name, subLexers, generateExpressionForNode);
    }
}