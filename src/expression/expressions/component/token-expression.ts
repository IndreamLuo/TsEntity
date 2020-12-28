import { ConstructorType } from "../../../utilities/types/constructor-type";
import { EntityExpressionBase } from "../base/entity-expression-base";

export class TokenExpression<T> extends EntityExpressionBase<T> {
    constructor (entityConstructor: ConstructorType<T>, Of: EntityExpressionBase<T>) {
        super (entityConstructor);
    }
}