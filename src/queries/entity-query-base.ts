import { ConstructorType } from "../schema/constructor-type";

export abstract class EntityQueryBase<T> {
    constructor (private EntityConstructor: ConstructorType<T>) {

    }
}