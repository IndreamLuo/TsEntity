import { ConstructorType } from "../schema/constructor-type";
import { EntityQueryBase } from "./entity-query-base";

export class DataSetQuery<T> extends EntityQueryBase<T> {
    constructor (EntityConstructor: ConstructorType<T>) {
        super(EntityConstructor);
    }
}