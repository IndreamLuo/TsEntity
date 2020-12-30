import { EntityExpressionBase } from "../expressions/base/entity-expression-base"
import { TokenExpression } from "../expressions/component/token-expression"

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Token(): TokenExpression<T>;
    }
}

EntityExpressionBase.prototype.Token = function<T>() {
    (this as any)._token = (this as any)._token || new TokenExpression<T>(this);
    return (this as any)._token;
}