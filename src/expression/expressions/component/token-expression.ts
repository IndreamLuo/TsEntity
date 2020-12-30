import { EntityExpressionBase } from "../base/entity-expression-base";

export class TokenExpression<T> extends EntityExpressionBase<T> {
    constructor (public Of: EntityExpressionBase<T>) {
        super (Of.EntityConstructor);
    }
}