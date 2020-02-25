"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_configuration_1 = require("./configuration/entity-configuration");
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
        entity_configuration_1.EntityConfiguration
            .Get(object.constructor)
            .SetColumn(columnName || propertyName);
    };
}
exports.column = column;
function id(columnName = 'Id') {
    return function (object, propertyName) {
        entity_configuration_1.EntityConfiguration
            .Get(object.constructor)
            .SetId(columnName || propertyName);
    };
}
exports.id = id;
function one(type, foreignKey = null) {
    return function (object, propertyName) {
        entity_configuration_1.EntityConfiguration
            .Get(object.constructor)
            .SetOne(propertyName, foreignKey || `${propertyName}Id`, type);
    };
}
exports.one = one;
function many(type) {
    return function (object, propertyName) {
        entity_configuration_1.EntityConfiguration
            .Get(object.constructor)
            .SetMany(propertyName, type);
    };
}
exports.many = many;
