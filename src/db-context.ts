import { TableEntitySet } from "./entity-set";

export class DbContext {
    Select<TEntity extends object>(entityType: { new(): TEntity}): TableEntitySet<TEntity> {
        return new TableEntitySet<TEntity>(entityType);
    }
}