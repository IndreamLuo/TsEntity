import { ValueExpressionBase } from "../base/value-expression-base";

export class NotExpression<T> extends ValueExpressionBase<T> {
    constructor (public Of: ValueExpressionBase<T>) {
        super();
    }
}