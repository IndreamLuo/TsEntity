import { ColumnDiagram } from "./column-diagram";
import { ConstructorType } from "./constructor-type";

export class EntityDiagram<TEntity> {
    constructor (public Constructor: ConstructorType<TEntity>, public Name: string) {}

    Ids: ColumnDiagram<any>[] = [];
    Columns: { [name: string]: ColumnDiagram<any> } = {};

    AddColumnIfNotExist<T>(name: string) {
        this.Columns[name] = this.Columns[name] || new ColumnDiagram<T>(name);
    }

    ResetIds(...columnNames: string[]) {
        this.Ids = columnNames.map(name => this.Columns[name]);
    }
}