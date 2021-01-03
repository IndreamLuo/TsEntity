import { SqlStatementBase } from "./sql-statement-base";

export class Table extends SqlStatementBase {
    constructor(public Name: string) {
        super();
    }
}