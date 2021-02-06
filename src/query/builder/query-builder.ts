import { StatementBase } from "../base/statement-base";
import { QueryPlan } from "../plan/query-plan";

export interface QueryBuilder {
    BuildQuery(queryPlan: QueryPlan): StatementBase;
    BuildQueryString(query: StatementBase): string;
}