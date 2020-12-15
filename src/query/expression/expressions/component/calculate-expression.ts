import { Operator } from "../../../../utilities/types/operators";
import { ValueExpressionBase } from "../base/value-expression-base";

export class CalculateExpression<T> extends ValueExpressionBase<T> {
    constructor (public Operator: Operator, public LeftValue: ValueExpressionBase<any>, public RightValue: ValueExpressionBase<any>) {
        super();
    }
} 