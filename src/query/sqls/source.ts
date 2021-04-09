import { ColumnDiagram } from "../../schema/column-diagram";
import { Column } from "./column";
import { SqlStatementBase } from "./sql-statement-base";
import { Table } from "./table";

export class Source<T> extends SqlStatementBase {
    constructor (public Data: Table<T>) {
        super(Data);

        this.Alias = `${this.Data.Name.toLowerCase()}${Source.Index++}`;
    }

    private static Index = 0;

    Alias?: string;

    Column(columnDiagram: ColumnDiagram) {
        return new Column<T>(this, columnDiagram);
    }
}