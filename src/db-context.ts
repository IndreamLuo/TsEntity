import { EntityBase, TableEntitySet } from "./entity-set";

export class DBContext {
    Repository<TEntity extends EntityBase<TEntity>>(entityType: { new(): TEntity}): TableEntitySet<TEntity> {
        return new TableEntitySet<TEntity>(entityType);
    }
}