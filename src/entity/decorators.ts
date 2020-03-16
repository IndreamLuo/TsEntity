import { EntityConfiguration } from "./configuration/entity-configuration";

export function table(tableName: string | null = null) {
  return (constructor: any) => {
    let configuration = EntityConfiguration.Get(constructor);
    
    tableName && (configuration.Table = tableName.toUpperCase());

    return constructor;
  }
}

export function column(columnName: string | null = null) {
  return function (object: Object, propertyName: string) {
    EntityConfiguration
      .Get(object.constructor)
      .SetColumn(columnName || propertyName);
  }
}

export function id(columnName: string = 'Id') {
  return function (object: Object, propertyName: string) {
    EntityConfiguration
      .Get(object.constructor)
      .SetId(columnName || propertyName);
  }
}

export function one<T>(type: { new(...args: any[]): T }, foreignKey: string | null = null) {
  return function (object: Object, propertyName: string) {
    foreignKey = foreignKey || `${propertyName}Id`;
    
    EntityConfiguration
      .Get(object.constructor)
      .SetOne(propertyName, foreignKey, type);
  }
}

export function many<T>(type: { new(...args: any[]): T }) {
  return function (object: Object, propertyName: string) {
    EntityConfiguration
      .Get(object.constructor)
      .SetMany(propertyName, type);
  }
}