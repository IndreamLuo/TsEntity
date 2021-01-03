import { SqlStatementBase } from "./sql-statement-base";
import { Table } from "./table";

export class Source extends SqlStatementBase {
    constructor (public Data: Table) {
        super();
    }

    Alias?: string;
}