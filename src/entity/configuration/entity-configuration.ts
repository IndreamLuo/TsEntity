import { EntityColumnConfiguration, EntityIdConfiguration, EntityRelationshipConfiguration } from "./entity-column-configuration";

export class EntityConfiguration {
    constructor (public Constructor: Function) {
        
    }

    Table: string = this.Constructor.name.toUpperCase();
    Id: EntityColumnConfiguration = EntityColumnConfiguration.Unknown;
    Columns: { [key: string]: EntityColumnConfiguration } = {}
    Relationships: { [key: string]: EntityRelationshipConfiguration } = {}

    private SetColumnConfigurationIfNotExist<TConfiguration extends EntityColumnConfiguration>(column: string, getConfiguration: { (column: string): TConfiguration }) {
        column = column.toUpperCase();
        return (this.Columns[column] = this.Columns[column] || getConfiguration(column)) as TConfiguration;
    }

    SetColumn(column: string) {
        return this.SetColumnConfigurationIfNotExist(column, column => new EntityColumnConfiguration(column));
    }

    SetId(column: string) {
        return this.Id = this.SetColumnConfigurationIfNotExist(column, column => new EntityIdConfiguration(column));
    }
    
    SetRelationship(relationship: EntityRelationshipConfiguration) {
        return this.Relationships[relationship.Name.toUpperCase()] = relationship;
    }

    SetOne<T>(column: string, foreignKey: string, type: { new(): T }) {
        return this.SetRelationship(new EntityRelationshipConfiguration(
            this,
            column,
            type,
            foreignKey));
    }

    SetMany<T>(column: string, type: { new(): T }) {
        return this.SetRelationship(new EntityRelationshipConfiguration(this, column, type, null, true));
    }

    static All: { [key: string]: EntityConfiguration[] } = {};

    static Get(constructor: any): EntityConfiguration {
        let configurations = (EntityConfiguration.All[constructor.name] = EntityConfiguration.All[constructor.name] || []);

        for (var index in configurations) {
            if (configurations[index].Constructor == constructor) {
                return configurations[index];
            }
        }

        let newConfiguration = new EntityConfiguration(constructor);
        configurations.push(newConfiguration);

        return newConfiguration;
    }
}