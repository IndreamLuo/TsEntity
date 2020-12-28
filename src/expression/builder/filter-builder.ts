import { LambdaLexers } from "../../utilities/lexer/lambda-lexers";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { FilterExpression } from "../expressions/filter-expression";

export {}

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Filter(condition: (item: T) => Boolean): FilterExpression<T>;
    }
}

EntityExpressionBase.prototype.Filter = function <T>(condition: (item: T) => Boolean) {
    let conditionExpression = condition.toString();
    let calculationExpressionLambdaTreeNode = LambdaLexers.CalculationLambda.Parse(conditionExpression);
    let calculationExpression = calculationExpressionLambdaTreeNode.Expression!.Expression;

    throw new Error();
}