import { ColumnDiagram } from "../../schema/column-diagram";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Column<TSource> extends SqlStatementBase {
    constructor(
        public Source: Source<TSource>,
        public Diagram: ColumnDiagram
    ) {
        super(Source);
    }
    
    get Name(): string {
        return this.Diagram.Name;
    }

    Alias?: string;
}