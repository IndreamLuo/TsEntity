import { ColumnDiagram } from "./column-diagram";
import { ConstructorType } from "../utilities/types/constructor-type";

export class EntityDiagram<TEntity> {
    constructor (public Constructor: ConstructorType<TEntity>, public Name: string) {}

    Ids: ColumnDiagram[] = [];
    Columns: { [name: string]: ColumnDiagram } = {};

    AddColumnIfNotExist(name: string) {
        this.Columns[name] = this.Columns[name] || new ColumnDiagram(name);
    }

    ResetIds(...columnNames: string[]) {
        this.Ids = columnNames.map(name => this.Columns[name]);
    }
}