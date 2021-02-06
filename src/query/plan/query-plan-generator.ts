import { ExpressionBase } from "../../expression/expressions/base/expression-base";
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
        } else {
            throw Error(`No implementation for generating QueryPlan for Query[${expression.Id}] of type(${expression.constructor}).`);
        }

        let stages: ExpressionBase[] = [];

        mergingQueryPlans.forEach(plan => {
            plan.AllExpressions.forEach(usedExpression => {
                if (queryPlan.IndexedAllExpressions[usedExpression.Id]) {
                    stages.push(usedExpression);
                } else {
                    queryPlan.AddExpression(usedExpression);
                }
            });
        });

        stages.sort((a, b) => queryPlan.IndexedAllExpressions[a.Id].Index - queryPlan.IndexedAllExpressions[b.Id].Index).forEach(stage => {
            queryPlan.PushExpressionToStage(stage);
        });

        queryPlan.AddExpression(expression);
        queryPlan.PushExpressionToStage(expression);

        return queryPlan;
    }
}