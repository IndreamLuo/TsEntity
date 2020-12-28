import { CalculationExpression } from "../../utilities/lexer/expressions/calculation-expression";
import { ConstructorType } from "../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";

export class FilterExpression<T> extends EntityExpressionBase<T> {
    constructor (entityConstructor: ConstructorType<T>, public Condition: CalculationExpression) {
        super(entityConstructor);
    }
}