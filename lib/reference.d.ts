import "reflect-metadata";
export declare function One<TToEntity extends object>(toEntity: () => {
    new (): TToEntity;
}, fromColumn?: string | undefined, toColumn?: string | undefined): (target: object, property: string) => void;
export declare function Many<TToEntity extends object>(toEntity: () => {
    new (): TToEntity;
}, fromColumn?: string | undefined, toColumn?: string | undefined): (target: object, property: string) => void;
