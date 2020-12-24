import { ComparisonOperator } from "../../enums/operators/comparison-operator";
import { ConditionOperator } from "../../enums/operators/condition-operator";
import { ValueType } from "../../types/value-type";
import { CalculationExpression } from "./calculation-expression";

export interface ComparisonExpression {
    Operator: ComparisonOperator | ConditionOperator;
    Left: ComparisonExpression | ValueType | CalculationExpression;
    Right?: ComparisonExpression | ValueType | CalculationExpression;
}
