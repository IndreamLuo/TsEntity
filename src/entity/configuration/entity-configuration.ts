import { EntityColumnConfiguration, EntityKeyConfiguration, EntityRelationshipConfiguration } from "./entity-column-configuration";

export class EntityConfiguration {
    constructor (public Constructor: any) {
        
    }

    Table: string = this.Constructor.name;
    Columns: { [key: string]: EntityColumnConfiguration } = {}

    private SetColumnConfigurationIfNotExist(column: string, getConfiguration: { (column: string): EntityColumnConfiguration }) {
        return this.Columns[column] = this.Columns[column] || getConfiguration(column);
    }

    SetColumn(column: string) {
        return this.SetColumnConfigurationIfNotExist(column, column => new EntityColumnConfiguration(column));
    }

    SetKey(column: string) {
        return this.SetColumnConfigurationIfNotExist(column, column => new EntityKeyConfiguration(column));
    }

    SetSingle<T>(column: string, type: { new(): T }) {
        return this.SetColumnConfigurationIfNotExist(column, column => new EntityRelationshipConfiguration(column));
    }

    SetMany<T>(column: string, type: { new(): T }) {
        return this.SetColumnConfigurationIfNotExist(column, column => new EntityRelationshipConfiguration(column, true));
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