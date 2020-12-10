import { TableEntitySet } from "./entity-set-domain";

export abstract class DbContext {
    All<TEntity extends object>(entityType: { new(): TEntity}): TableEntitySet<TEntity> {
        return new TableEntitySet<TEntity>(entityType);
    }
}

export class Sqlite3DbContext extends DbContext {
    constructor (public DbPath: string) {
        super();

        let sqlite3 = require('sqlite3').verbose();
        this.Database = new sqlite3.Database(this.DbPath, sqlite3.OPEN_READWRITE);
    }

    Database: any;
}