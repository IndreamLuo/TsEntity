"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_column_configuration_1 = require("./entity-column-configuration");
class EntityConfiguration {
    constructor(Constructor) {
        this.Constructor = Constructor;
        this.Table = this.Constructor.name;
        this.Columns = {};
    }
    SetColumn(column) {
        return this.Columns[column] = this.Columns[column] || new entity_column_configuration_1.EntityColumnConfiguration(column);
    }
    SetKey(column) {
        let configuration = this.SetColumn(column);
        configuration.IsKey = true;
        return configuration;
    }
    static Get(constructor) {
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
exports.EntityConfiguration = EntityConfiguration;
EntityConfiguration.All = {};
