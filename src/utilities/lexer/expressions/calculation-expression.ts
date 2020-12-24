import { CalculationOperator } from "../../enums/operators/calculation-operator";
import { ValueType } from "../../types/value-type";
import { SelectFieldExpression } from "./select-field-expression";

export interface CalculationExpression {
    Operator: CalculationOperator;
    Left: CalculationExpression | ValueType | SelectFieldExpression;
    Right?: CalculationExpression | ValueType | SelectFieldExpression;
}