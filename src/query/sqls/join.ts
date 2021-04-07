import { Calculation } from "./calculation";
import { Select } from "./select";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Join extends SqlStatementBase {
    constructor (
        public Select: Select,
        public Joinee: Source<any>
    ) {
        super(Select);
    }

    IsInner = false;
    IsLeft?: Boolean;
    On!: Calculation;
}