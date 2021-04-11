import { SourceExpressionBuilder } from "../../expression/builder/source-builder";
import { EntityExpressionBase } from "../../expression/expressions/base/entity-expression-base";
import { StatementBase } from "../../query/base/statement-base";
import { QueryBuilder } from "../../query/builder/query-builder";
import { QueryPlanGenerator } from "../../query/plan/query-plan-generator";
import { cache } from "../../utilities/cache/cache";
import { ConstructorType } from "../../utilities/types/constructor-type";
import { DataSetQuerying } from "../query/data-set-querying";
import { QueryingBase } from "../query/querying-base";

export abstract class DbContextBase {
    constructor(
        public QueryPlanGenerator: QueryPlanGenerator,
        public QueryBuilder: QueryBuilder
    ) {
        
    }

    @cache(entityType => entityType.name)
    Source<T>(entityType: ConstructorType<T>): QueryingBase<T> {
        let sourceExpression = SourceExpressionBuilder.New(entityType);
        return new DataSetQuerying(this, sourceExpression);
    }

    async Query<T>(expression: EntityExpressionBase<T>): Promise<T[]> {
        let plan = this.QueryPlanGenerator.BuildQueryPlan(expression);
        let statement = this.QueryBuilder.BuildQuery(plan);

        return await this.QueryStatement(statement);
    }

    protected abstract QueryStatement<T>(statement: StatementBase): Promise<T[]>;
}