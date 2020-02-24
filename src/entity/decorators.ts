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
    let configuration = EntityConfiguration.Get(object.constructor);
    configuration.Columns[propertyName] = new EntityColumnConfiguration(columnName || propertyName);
  }
}