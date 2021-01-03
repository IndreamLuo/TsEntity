import { SqlStatementBase } from "./sql-statement-base";

export class SqlQuery extends SqlStatementBase {
    SubQueries: SqlStatementBase[] = [];
}