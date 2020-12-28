import "reflect-metadata";
import { ReferenceEntitySet } from "./entity/entity-set-domain";

export function One<TToEntity extends object>(toEntity: () => { new(): TToEntity }, fromColumn: string | undefined = undefined, toColumn: string | undefined = undefined) {
    return function(target: object, property: string) {
        let val: any = new ReferenceEntitySet(target as any, fromColumn || `${property}Id`, toEntity(), `${target.constructor.name}Id`);

        Object.defineProperty(target, property, {
            get: () => val,
            set: (value :TToEntity) => val = value,
            configurable: true
        });
    }
}

export function Many<TToEntity extends object>(toEntity: () => { new(): TToEntity }, fromColumn: string | undefined = undefined, toColumn: string | undefined = undefined) {
    return function (target: object, property: string) {
        let val: any = new ReferenceEntitySet(target as any, fromColumn || `${property}Id`, toEntity(), toColumn || `${target.constructor.name}Id`);

        Object.defineProperty(target, property, {
            get: () => val,
            set: (value :TToEntity[]) => val = value,
            configurable: true,
            enumerable: true,
        });
    }
}