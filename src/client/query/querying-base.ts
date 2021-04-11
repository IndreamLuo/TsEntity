import { EntityExpressionBase } from "../../expression/expressions/base/entity-expression-base";
import { DbContextBase } from "../db-context/db-context-base";

export abstract class QueryingBase<T> {
    constructor(
        protected DbContext: DbContextBase,
        public Expression: EntityExpressionBase<T>
    ) {
        
    }

    async Query(): Promise<T[]> {
        return await this.DbContext.Query(this.Expression);
    }
}