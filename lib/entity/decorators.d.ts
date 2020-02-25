export declare function table(tableName?: string | null): (constructor: any) => any;
export declare function column(columnName?: string | null): (object: Object, propertyName: string) => void;
export declare function id(columnName?: string): (object: Object, propertyName: string) => void;
export declare function one<T>(type: {
    new (...args: any[]): T;
}, foreignKey?: string | null): (object: Object, propertyName: string) => void;
export declare function many<T>(type: {
    new (...args: any[]): T;
}): (object: Object, propertyName: string) => void;
