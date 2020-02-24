"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_configuration_1 = require("./configuration/entity-configuration");
const entity_column_configuration_1 = require("./configuration/entity-column-configuration");
function table(tableName = null) {
    return (constructor) => {
        let configuration = entity_configuration_1.EntityConfiguration.Get(constructor);
        tableName && (configuration.Table = tableName);
        return constructor;
    };
}
exports.table = table;
function column(columnName = null) {
    return function (object, propertyName) {
        let configuration = entity_configuration_1.EntityConfiguration.Get(object.constructor);
        configuration.Columns[propertyName] = new entity_column_configuration_1.EntityColumnConfiguration(columnName || propertyName);
    };
}
exports.column = column;
