export declare class EntityConfiguration {
    Constructor: any;
    constructor(Constructor: any);
    Table: string;
    Columns: {
        [key: string]: any;
    };
    static All: {
        [key: string]: EntityConfiguration[];
    };
    static Get(constructor: any): EntityConfiguration;
}
