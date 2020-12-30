import { ColumnDiagram } from "../../../schema/column-diagram";
import { EntityExpressionBase } from "../base/entity-expression-base";
import { ValueExpressionBase } from "../base/value-expression-base";

export class ColumnExpression<T, TColumn> extends ValueExpressionBase<TColumn> {
    constructor(public readonly Of: EntityExpressionBase<T>, public Diagram: ColumnDiagram) {
        super();
    }
}