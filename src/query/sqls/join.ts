import { Calculation } from "./calculation";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Join extends SqlStatementBase {
    constructor (public Joinee: Source) {
        super();
    }

    IsInner = false;
    IsLeft?: Boolean;
    On!: Calculation;
}