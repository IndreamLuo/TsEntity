import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { QueryPlan } from "../plan/query-plan";
import { ExpressionStatementStack } from "./expression-statement-stack";
import { Select } from "./select";
import { SqlStatementBase } from "./sql-statement-base";

export class SqlQuery extends SqlStatementBase {
    constructor (public QueryPlan: QueryPlan) {
        super(undefined);
    }

    ExpressionStatementStack = new ExpressionStatementStack();

    SubQueries: SqlStatementBase[] = [];

    private AddSubQuery(subQuery: Select) {
        this.SubQueries.push(subQuery);
    }

    CreateAndAddSelect(expression: ExpressionBase) {
        let select = new Select(this);

        this.ExpressionStatementStack.AddForExpressionStatement(expression, select);
        this.AddSubQuery(select);

        return select;
    }

    GetLast() {
        return this.SubQueries[this.SubQueries.length - 1];
    }
}