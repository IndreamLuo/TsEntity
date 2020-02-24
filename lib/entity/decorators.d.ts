export declare function table(tableName?: string | null): (constructor: any) => any;
export declare function column(columnName?: string | null): (object: Object, propertyName: string) => void;
export declare function key(columnName?: string): (object: Object, propertyName: string) => void;
