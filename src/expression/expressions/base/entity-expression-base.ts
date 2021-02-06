import { ConstructorType } from "../../../utilities/types/constructor-type";
import { ExpressionBase } from "./expression-base";

export abstract class EntityExpressionBase<T> extends ExpressionBase {
    constructor (public EntityConstructor: ConstructorType<T>) {
        super();
    }
}

require("../../builder/column-builder");
require("../../builder/token-builder");
require("../../builder/source-builder");
require("../../builder/filter-builder");
require("../../builder/reference-builder");