import { ExpressionTreeNode } from "../expression-tree-node";
import { Lexer } from "./lexer";

export class NumberLexer extends Lexer<Number> {
    constructor (
        name: string,
        subLexers: (string | Lexer<any> | (() => Lexer<any>))[] | string,
        generateExpressionForNode: (node: ExpressionTreeNode<Number>) => Number = node => Number.parseFloat(node.Value as string)
    ) {
        super(name, subLexers, generateExpressionForNode);
    }
}