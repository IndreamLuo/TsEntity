import { EntityBase, TableEntitySet } from "./entity-set";
export declare class DBContext {
    Repository<TEntity extends EntityBase<TEntity>>(entityType: {
        new (): TEntity;
    }): TableEntitySet<TEntity>;
}
