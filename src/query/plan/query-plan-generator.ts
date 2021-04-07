import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { CalculateExpression } from "../../expression/expressions/component/calculate-expression";
import { ColumnExpression } from "../../expression/expressions/component/column-expression";
import { ConstantExpression } from "../../expression/expressions/component/constant-expression";
import { NotExpression } from "../../expression/expressions/component/not-expression";
import { TokenExpression } from "../../expression/expressions/component/token-expression";
import { VariableExpression } from "../../expression/expressions/component/variable-expression";
import { FilterExpression } from "../../expression/expressions/filter-expression";
import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { SourceExpression } from "../../expression/expressions/source-expression";
import { QueryPlan } from "./query-plan";

export class QueryPlanGenerator {
    GeneratedQueries: { [id: number]: QueryPlan } = [];

    BuildQueryPlan(expression: ExpressionBase): QueryPlan {
        let queryPlan = this.GeneratedQueries[expression.Id];

        if (queryPlan) {
            return queryPlan;
        }

        queryPlan = new QueryPlan(expression);
        let mergingQueryPlans: QueryPlan[] = [];

        if (expression instanceof SourceExpression) {
        } else if (expression instanceof ReferenceExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.From));
        } else if (expression instanceof FilterExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.From));
            mergingQueryPlans.push(this.BuildQueryPlan(expression.Condition));
        } else if (expression instanceof CalculateExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.LeftValue));
            mergingQueryPlans.push(this.BuildQueryPlan(expression.RightValue));
        } else if (expression instanceof ColumnExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.Of));
        } else if (expression instanceof ConstantExpression) {
        } else if (expression instanceof NotExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.Of));
        } else if (expression instanceof TokenExpression) {
            mergingQueryPlans.push(this.BuildQueryPlan(expression.Of));
        } else if (expression instanceof VariableExpression) {
        } else {
            throw Error(`No implementation for generating QueryPlan for Query[${expression.Id}] of type(${expression.constructor}).`);
        }

        let stages: ExpressionBase[] = [];

        mergingQueryPlans.forEach(plan => {
            plan.AllExpressions.forEach(usedExpression => {
                if (queryPlan.Contains(usedExpression)) {
                    stages.push(usedExpression);
                } else {
                    queryPlan.AddExpression(usedExpression);
                }
            });
        });

        stages
            .sort((a, b) => queryPlan.IndexedAllExpressions[a.Id].Index - queryPlan.IndexedAllExpressions[b.Id].Index)
            .forEach(stage => {
                queryPlan.PushExpressionToStage(stage);
            });

        queryPlan.AddExpression(expression);
        queryPlan.PushExpressionToStage(expression);

        return queryPlan;
    }
}