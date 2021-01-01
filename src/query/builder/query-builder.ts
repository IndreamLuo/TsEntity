import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { StatementBase } from "../base/statement-base";

export interface QueryBuilder {
    BuildQuery(expression: ExpressionBase): StatementBase;
    BuildQueryString(query: StatementBase): string;
}