import { EntityColumnConfiguration } from "./entity-column-configuration";

export class EntityConfiguration {
    constructor (public Constructor: any) {
        
    }

    Table: string = this.Constructor.name;
    Columns: { [key: string]: EntityColumnConfiguration } = {}

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