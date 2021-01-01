import { Column } from "./column";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Select extends SqlStatementBase {
    Columns: Column[] = [];
    From?: Source;
}