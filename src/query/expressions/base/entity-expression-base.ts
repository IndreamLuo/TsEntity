import { ConstructorType } from "../../../utilities/types/constructor-type";

export abstract class EntityExpressionBase<T> {
    constructor (private EntityConstructor: ConstructorType<T>) {}
}