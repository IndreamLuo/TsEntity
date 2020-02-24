import { EntityConfiguration } from "./configuration/entity-configuration";
import { EntityColumnConfiguration } from "./configuration/entity-column-configuration";

export function table(tableName: string | null = null) {
  return (constructor: any) => {
    let configuration = EntityConfiguration.Get(constructor);
    
    tableName && (configuration.Table = tableName);

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

export function key(columnName: string = 'Id') {
  return function (object: Object, propertyName: string) {
    EntityConfiguration
      .Get(object.constructor)
      .SetKey(columnName || propertyName);
  }
}

export function many<T>(type: { new(): T }, foreignKeys: string | string[] | null = null) {
  return function (object: Object, propertyName: string) {
    
  }
}