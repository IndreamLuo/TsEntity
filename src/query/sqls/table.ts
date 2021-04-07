import { EntityDiagram } from "../../schema/entity-diagram";
import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Table<T> extends SqlStatementBase {
    constructor(
        protected Parent: SqlStatementBase,
        public EntityDiagram: EntityDiagram<T>
    ) {
        super(Parent);

        this.Source = new Source(this);
    }

    get Name() {
        return this.EntityDiagram.Name;
    }

    Source: Source<T>;
}