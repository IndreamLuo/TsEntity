export class ExpressionTreeNode<T> extends Array<ExpressionTreeNode<any>> {
    constructor (public Name: string, public Value?: string) {
        super();
    }

    Expression!: T;
}