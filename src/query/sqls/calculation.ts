import { Operator } from "../../utilities/types/operators";
import { ValueType } from "../../utilities/types/value-type";
import { Column } from "./column";
import { Join } from "./join";
import { Select } from "./select";
import { SqlStatementBase } from "./sql-statement-base";

export type CalculationValue = Calculation | Column<any> | ValueType;

export class Calculation extends SqlStatementBase {
    constructor (
        public Parent: Select | Join,
        public Operator: Operator,
        public Left: CalculationValue,
        public Right: CalculationValue | undefined = undefined
    ) {
        super(Parent);

        this.ChangeParent(Parent);
    }

    protected ChangeParent(parent: Select | Join) {
        super.ChangeParent(parent);

        (this.Left instanceof Calculation)
        && this.Left.ChangeParent(parent);
        
        this.Right
        && (this.Right instanceof Calculation)
        && this.Right.ChangeParent(parent);
    }
}