import { EntityExpressionBase } from "./base/entity-expression-base";
import { ValueExpressionBase } from "./base/value-expression-base";

export class FilterExpression<T> extends EntityExpressionBase<T> {
    constructor (public From: EntityExpressionBase<T>, public Condition: ValueExpressionBase<any>) {
        super(From.EntityConstructor);
    }
}