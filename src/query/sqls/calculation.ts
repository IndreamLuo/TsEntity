import { Operator } from "../../utilities/types/operators";
import { ValueType } from "../../utilities/types/value-type";
import { Column } from "./column";
import { SqlStatementBase } from "./sql-statement-base";

export type CalculationValue = Calculation | Column | ValueType;

export class Calculation extends SqlStatementBase {
    constructor(public Operator: Operator, public Left: CalculationValue, public Right: CalculationValue | undefined = undefined) {
        super()
    }
}