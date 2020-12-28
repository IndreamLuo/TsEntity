import { ValueType } from "../../types/value-type";
import { OperatorExpression } from "./operator-expression";
import { SelectFieldExpression } from "./select-field-expression";

export interface CalculationExpression {
    Operator: OperatorExpression;
    Left: CalculationExpression | ValueType | SelectFieldExpression;
    Right?: CalculationExpression | ValueType | SelectFieldExpression;
}
