import { EntityConfiguration } from "./entity-configuration";
export declare class EntityColumnConfiguration {
    Name: string;
    constructor(Name: string);
    static Unknown: EntityColumnConfiguration;
}
export declare class EntityIdConfiguration extends EntityColumnConfiguration {
}
export declare class EntityRelationshipConfiguration {
    EntityConfiguration: EntityConfiguration;
    Name: string;
    Type: {
        new (): any;
    };
    Many: boolean;
    constructor(EntityConfiguration: EntityConfiguration, Name: string, Type: {
        new (): any;
    }, foreignKey?: string | null, Many?: boolean);
    ForeignKey: EntityColumnConfiguration | null;
}
