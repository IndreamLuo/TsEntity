import { EntityColumnConfiguration, EntityIdConfiguration, EntityRelationshipConfiguration } from "./entity-column-configuration";
export declare class EntityConfiguration {
    Constructor: any;
    constructor(Constructor: any);
    Table: string;
    Id: EntityColumnConfiguration;
    Columns: {
        [key: string]: EntityColumnConfiguration;
    };
    Relationships: {
        [key: string]: EntityRelationshipConfiguration;
    };
    private SetColumnConfigurationIfNotExist;
    SetColumn(column: string): EntityColumnConfiguration;
    SetId(column: string): EntityIdConfiguration;
    SetRelationship(relationship: EntityRelationshipConfiguration): EntityRelationshipConfiguration;
    SetOne<T>(column: string, foreignKey: string, type: {
        new (): T;
    }): EntityRelationshipConfiguration;
    SetMany<T>(column: string, type: {
        new (): T;
    }): EntityRelationshipConfiguration;
    static All: {
        [key: string]: EntityConfiguration[];
    };
    static Get(constructor: any): EntityConfiguration;
}
