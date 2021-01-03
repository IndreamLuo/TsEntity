import { LambdaLexers } from "../utilities/lexer/lambda-lexers";
import { ConstructorType } from "../utilities/types/constructor-type";
import { Pairing } from "./pairing";
import { Schema } from "./schema";

export function entity(name: string | null = null) {
  return <T extends { new(...args: any[]): {} }>(constructor: T) => {
    Schema.Base.GetOrAddEntity(constructor, name || constructor.name);
  }
}

export function column<T>(columnName: string | null = null) {
  return function (object: Object, propertyName: string) {
    Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<T>)
      .AddColumnIfNotExist(columnName || propertyName);
  }
}

export function id(columnName: string = 'Id') {
  return function (object: Object, propertyName: string) {
    let entityDiagram = Schema.Base.GetOrAddEntity(object.constructor as ConstructorType<any>)
    entityDiagram.AddColumnIfNotExist(columnName)
    entityDiagram.AddId(columnName || propertyName);
  }
}

export function one<TFrom, TTo>(getType: () => ConstructorType<TTo>): Function;
export function one<TFrom, TTo>(getType: () => ConstructorType<TTo>, fromForeignKeys: string[]): Function;
export function one<TFrom, TTo>(
  getType: () => ConstructorType<TTo>,
  pairingPattern: ((from: TFrom | any, to: TTo | any) => any) | string[] | undefined = undefined
) {
  return function (object: Object, propertyName: string) {
    AddRelationshipKeyPairings(false, propertyName, object.constructor as any, getType, pairingPattern);
  }
}

export function many<TFrom, TTo>(getType: () => ConstructorType<TTo>): Function;
export function many<TFrom, TTo>(getType: () => ConstructorType<TTo>, keysMatch: (from: TFrom, to: TTo) => any): Function;
export function many<TFrom, TTo>(
  getType: () => ConstructorType<TTo>,
  pairingPattern: ((from: TFrom | any, to: TTo | any) => any) | string[] | undefined = undefined
) {
  return function (object: Object, propertyName: string) {
    AddRelationshipKeyPairings(true, propertyName, object.constructor as any, getType, pairingPattern);
  }
}

function AddRelationshipKeyPairings<TFrom, TTo>(isMultiple: Boolean, propertyName: string, fromType: ConstructorType<TFrom>, getToType: () => ConstructorType<TTo>, pairingPattern: ((from: any, to: any) => any) | string[] | undefined) {
  let pairings: Pairing[];

  if (pairingPattern instanceof Function) {
    let expression = LambdaLexers.PairingPatternLambda.Parse(pairingPattern.toString());
    pairings = expression.Expression!.Expression;
  } else {
    let foreignKeys = pairingPattern as string[] || [];
    pairings = foreignKeys.map(foreignKey => ({ FromKey: foreignKey, ToKey: undefined }));
  }

  let fromEntity = Schema.Base.GetOrAddEntity(fromType as ConstructorType<TFrom>);

  fromEntity.AddRelationship(isMultiple, getToType, propertyName, pairings);
}