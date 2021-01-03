import { Column } from "./column";
import { Join } from "./join";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Select extends SqlStatementBase {
    Columns: Column[] = [];
    From?: Source;
    JOINs: Join[] = [];
}