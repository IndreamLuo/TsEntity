import { SqlQueryBuilder } from "../../query/builder/sql-query-builder";
import { QueryPlanGenerator } from "../../query/plan/query-plan-generator";
import { SqlDbContextBase } from "./sql-db-context-base";

export class MsSqlDbContext extends SqlDbContextBase {
    constructor(
        public ConnectionString: String,
        queryPlanGenerator: QueryPlanGenerator,
        public SqlQueryBuilder: SqlQueryBuilder
    ) {
        super(queryPlanGenerator, SqlQueryBuilder);
    }

    private msSqlClient!: Promise<any>;

    get MsSqlClient(): Promise<any> {
        if (!this.msSqlClient) {
            let mssql = require('mssql/msnodesqlv8');
            this.msSqlClient = (mssql.connect(this.ConnectionString) as Promise<any>);
        }

        return this.msSqlClient;
    }

    async QuerySql<T>(sql: String): Promise<T[]> {
        return (await (await this.MsSqlClient).request().query(sql)).recordset;
    }
}