import { ConstructorType } from "../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";
import { ConditionExpression } from "./condition/condition-expression";

export class FilterExpression<T> extends EntityExpressionBase<T> {
    constructor (entityConstructor: ConstructorType<T>, public Condition: ConditionExpression) {
        super(entityConstructor);
    }
}