import { SqlQueryBuilder } from "../../query/builder/sql-query-builder";
import { QueryPlanGenerator } from "../../query/plan/query-plan-generator";
import { SqlQuery } from "../../query/sqls/sql-query";
import { DbContextBase } from "./db-context-base";

export abstract class SqlDbContextBase extends DbContextBase {
    constructor(
        queryPlanGenerator: QueryPlanGenerator,
        public SqlQueryBuilder: SqlQueryBuilder
    ) {
        super(queryPlanGenerator, SqlQueryBuilder);
    }

    protected async QueryStatement<T>(statement: SqlQuery): Promise<T[]> {
        let sql = this.SqlQueryBuilder.BuildQueryString(statement);
        
        return await this.QuerySql(sql);
    }
    
    abstract QuerySql<T>(sql: String): Promise<T[]>;
}