import { Operator } from "../../types/operators";
import { ValueType } from "../../types/value-type";
import { SelectFieldExpression } from "./select-field-expression";

export interface CalculationExpression {
    Operator: Operator;
    Left: CalculationExpression | ValueType | SelectFieldExpression;
    Right?: CalculationExpression | ValueType | SelectFieldExpression;
}
