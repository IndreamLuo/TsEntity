import { ConstructorType } from "../../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";

export class SourceExpression<T> extends EntityExpressionBase<T> {
    constructor (entityConstructor: ConstructorType<T>) {
        super(entityConstructor);
    }
}