"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_column_configuration_1 = require("./entity-column-configuration");
class EntityConfiguration {
    constructor(Constructor) {
        this.Constructor = Constructor;
        this.Table = this.Constructor.name;
        this.Id = entity_column_configuration_1.EntityColumnConfiguration.Unknown;
        this.Columns = {};
        this.Relationships = {};
    }
    SetColumnConfigurationIfNotExist(column, getConfiguration) {
        column = column.toUpperCase();
        return (this.Columns[column] = this.Columns[column] || getConfiguration(column));
    }
    SetColumn(column) {
        return this.SetColumnConfigurationIfNotExist(column, column => new entity_column_configuration_1.EntityColumnConfiguration(column));
    }
    SetId(column) {
        return this.Id = this.SetColumnConfigurationIfNotExist(column, column => new entity_column_configuration_1.EntityIdConfiguration(column));
    }
    SetRelationship(relationship) {
        return this.Relationships[relationship.Name.toUpperCase()] = relationship;
    }
    SetOne(column, foreignKey, type) {
        return this.SetRelationship(new entity_column_configuration_1.EntityRelationshipConfiguration(this, column, type, foreignKey));
    }
    SetMany(column, type) {
        return this.SetRelationship(new entity_column_configuration_1.EntityRelationshipConfiguration(this, column, type, null, true));
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
