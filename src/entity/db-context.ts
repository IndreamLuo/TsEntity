import { TableEntitySet } from "./entity-set-domain";

export class DbContext {
    Select<TEntity extends object>(entityType: { new(): TEntity}): TableEntitySet<TEntity> {
        return new TableEntitySet<TEntity>(entityType);
    }
}