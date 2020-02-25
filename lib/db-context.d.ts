import { TableEntitySet } from "./entity-set";
export declare class DbContext {
    Select<TEntity extends object>(entityType: {
        new (): TEntity;
    }): TableEntitySet<TEntity>;
}
