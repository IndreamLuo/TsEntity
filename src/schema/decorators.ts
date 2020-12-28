import { ConstructorType } from "../utilities/types/constructor-type";
import { Schema } from "./schema";

export function entity(name: string | null = null) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    Schema.Base.GetOrAddEntity(constructor, name || constructor.name);
  }
}

export function column(columnName: string | null = null) {
  return function <T>(object: Object, propertyName: string) {
    Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<T>)
      .AddColumnIfNotExist<T>(columnName || propertyName);
  }
}

export function id(columnName: string = 'Id') {
  return function <T>(object: Object, propertyName: string) {
    let entityDiagram = Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<any>)
    entityDiagram.AddColumnIfNotExist<T>(columnName)
    entityDiagram.ResetIds(columnName || propertyName);
  }
}

export function one<T>(getType: (() => T) | any, fromForeignKey: string | null = null) {
  return function (object: Object, propertyName: string) {
    let foreignKey = fromForeignKey || `${propertyName}Id`;

    let fromEntity = Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<any>);

    Schema.Base.AddRelationship(false, fromEntity, getType, propertyName, foreignKey);
  }
}

export function many<T>(getType: () => T, ...toForeignKeys: string[]) {
  return function (object: Object, propertyName: string) {
    let fromEntity = Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<any>);

    if (!toForeignKeys.length) {
      toForeignKeys.push(`${fromEntity.Name}Id`);
    }

    Schema.Base.AddRelationship(true, fromEntity, getType, propertyName, ...toForeignKeys);
  }
}