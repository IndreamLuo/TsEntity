import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { NumberDictionary } from "../../utilities/types/dictionaries";

export class QueryPlan {
    constructor (public Expression: ExpressionBase) {}

    AllExpressions: ExpressionBase[] = [];
    IndexedAllExpressions: NumberDictionary<{ Index: number, Expression: ExpressionBase}> = {}
    StagingExpressions: ExpressionBase[] = [];
    IndexedStagingExpressions: NumberDictionary<{ Index: number, Expression: ExpressionBase}> = {};

    AddExpression(expression: ExpressionBase) {
        if (!this.IndexedAllExpressions[expression.Id]) {
            this.IndexedAllExpressions[expression.Id] = {
                Index: this.AllExpressions.length,
                Expression: expression
            };
            this.AllExpressions.push(expression);
        }
    }

    PushExpressionToStage(expression: ExpressionBase) {
        this.IndexedStagingExpressions[expression.Id] = {
            Index: this.StagingExpressions.length,
            Expression: expression
        };
        this.StagingExpressions.push(expression);
    }
}