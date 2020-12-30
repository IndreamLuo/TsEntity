import { Schema } from "../../schema/schema";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { ColumnExpression } from "../expressions/component/column-expression";

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Column(name: string): ColumnExpression<T, any>;
    }
}

EntityExpressionBase.prototype.Column = function <T>(name: string) {
    let entityDiagram = Schema.Base.GetOrAddEntity<T>(this.EntityConstructor);
    let ColumnDiagram = entityDiagram.Columns[name];
    
    return new ColumnExpression(this, ColumnDiagram);
}