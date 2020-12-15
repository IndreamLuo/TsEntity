import { ValueExpressionBase } from "../base/value-expression-base";

export class ConditionExpression extends ValueExpressionBase<Boolean> {
    constructor (public Condition: ValueExpressionBase<Boolean>) {
        super();
    }
}