import { ConstructorType } from "../../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";
import { TokenExpression } from "./component/token-expression";
import { ConditionExpression } from "./condition/condition-expression";

export class FilterExpression<T> extends EntityExpressionBase<T> {
    constructor (entityConstructor: ConstructorType<T>, public TokenCondition: (item: TokenExpression<T>) => ConditionExpression) {
        super(entityConstructor);
    }
}