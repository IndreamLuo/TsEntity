import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { NumberDictionary } from "../../utilities/types/dictionaries";
import { QueryPlan } from "../plan/query-plan";
import { SqlStatementBase } from "./sql-statement-base";

export class SqlQuery extends SqlStatementBase {
    constructor (public QueryPlan: QueryPlan) {
        super();
    }

    QueriedExpressions: NumberDictionary<{ Expression: ExpressionBase, SubQueryIndex: number }> = {};
    SubQueries: SqlStatementBase[] = [];

    AddSubQuery(subQuery: SqlStatementBase): void;
    AddSubQuery(subQuery: SqlStatementBase, expression: ExpressionBase): void;
    AddSubQuery(subQuery: SqlStatementBase, expression?: ExpressionBase) {
        if (expression) {
            this.QueriedExpressions[expression.Id] = {
                Expression: expression,
                SubQueryIndex: this.SubQueries.length
            }
        }

        this.SubQueries.push(subQuery);
    }
}