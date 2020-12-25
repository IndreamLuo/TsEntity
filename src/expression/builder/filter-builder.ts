import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { FilterExpression } from "../expressions/filter-expression";

export {}

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Filter(condition: (item: T) => Boolean): FilterExpression<T>;
    }
}

EntityExpressionBase.prototype.Filter = function <T>(condition: (item: T) => Boolean) {
    let conditionExpression = condition.toString();

    throw new Error();
}