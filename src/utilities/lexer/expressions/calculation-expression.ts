import { CalculationOperator } from "../../enums/operators/calculation-operator";
import { ComparisonOperator } from "../../enums/operators/comparison-operator";
import { ConditionOperator } from "../../enums/operators/condition-operator";
import { ValueType } from "../../types/value-type";
import { OperatorExpression } from "./operator-expression";
import { SelectFieldExpression } from "./select-field-expression";

export interface CalculationExpression {
    ResultType: string;
    Operator: OperatorExpression;
    Left: CalculationExpression | ValueType | SelectFieldExpression;
    Right?: CalculationExpression | ValueType | SelectFieldExpression;
}
