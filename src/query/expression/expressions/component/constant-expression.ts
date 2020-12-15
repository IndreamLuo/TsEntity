import { ValueType } from "../../../../utilities/types/value-type";
import { ValueExpressionBase } from "../base/value-expression-base";

export class ConstantExpression<T extends ValueType | null> extends ValueExpressionBase<T> {
    constructor (public Value: T) {
        super();
    }
}