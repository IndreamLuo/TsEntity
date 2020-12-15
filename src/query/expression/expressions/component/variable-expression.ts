import { ValueType } from "../../../../utilities/types/value-type";
import { ValueExpressionBase } from "../base/value-expression-base";

export class VariableExpression<T extends ValueType> extends ValueExpressionBase<T> {
    constructor (public Value: T) {
        super();
    }
}