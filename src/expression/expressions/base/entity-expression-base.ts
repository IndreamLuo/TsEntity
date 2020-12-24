import { ConstructorType } from "../../../utilities/types/constructor-type";

export abstract class EntityExpressionBase<T> {
    constructor (public EntityConstructor: ConstructorType<T>) {}
}

require("../../builder/source-builder");
require("../../builder/filter-builder");
require("../../builder/reference-builder");