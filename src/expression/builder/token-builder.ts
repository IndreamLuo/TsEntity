import { NumberDictionary } from "../../utilities/types/dictionaries";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base"
import { TokenExpression } from "../expressions/component/token-expression"

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Token(): TokenExpression<T>;
        Tokens: NumberDictionary<TokenExpression<T>>;
    }
}

EntityExpressionBase.prototype.Token = function<T>(id: number = 0) {
    this.Tokens = this.Tokens || {};
    this.Tokens[id] = this.Tokens[id] || new TokenExpression<T>(this);
    return this.Tokens[id];
}