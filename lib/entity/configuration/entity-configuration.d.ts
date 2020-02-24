import { EntityColumnConfiguration } from "./entity-column-configuration";
export declare class EntityConfiguration {
    Constructor: any;
    constructor(Constructor: any);
    Table: string;
    Columns: {
        [key: string]: EntityColumnConfiguration;
    };
    SetColumn(column: string): EntityColumnConfiguration;
    SetKey(column: string): EntityColumnConfiguration;
    static All: {
        [key: string]: EntityConfiguration[];
    };
    static Get(constructor: any): EntityConfiguration;
}
