export abstract class SqlStatementBase {
    constructor(protected Parent: SqlStatementBase | undefined) {}

    protected ChangeParent(parent: SqlStatementBase | undefined) {
        this.Parent = parent;
    }
}