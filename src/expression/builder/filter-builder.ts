import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { TokenExpression } from "../expressions/component/token-expression";
import { ConditionExpression } from "../expressions/condition/condition-expression";
import { FilterExpression } from "../expressions/filter-expression";

export {}

declare module '../expressions/base/entity-expression-base' {
    interface EntityExpressionBase<T> {
        Filter(tokenCondition: (item: TokenExpression<T>) => ConditionExpression): FilterExpression<T>;
    }
}

EntityExpressionBase.prototype.Filter = function <T>(tokenCondition: (item: TokenExpression<T>) => ConditionExpression) {
    return new FilterExpression(this.EntityConstructor, tokenCondition);
}