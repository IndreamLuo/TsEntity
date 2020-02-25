export declare class EntityConfig<TEntity> {
    Table: string;
    Mappings: {
        [column: string]: {
            (token: TEntity & ITokenEntity): Column<boolean | number | string>;
        };
    };
}
export interface IEntityQuery {
    GetQueryString(): string;
}
export declare abstract class EntityItem<TEntity> implements IEntityQuery {
    EntityType: {
        new (): TEntity;
    };
    constructor(EntityType: {
        new (): TEntity;
    });
    Entity: TEntity;
    Source?: SourceEntitySet<TEntity>;
    abstract GetQueryString(): string;
    Select<TSelected>(query: (eachEnitity: TEntity & ITokenEntity) => EntitySet<TSelected>, conditionType?: {
        new (): TSelected;
    } | null): EntitySet<TSelected>;
}
export declare class SingleEntity<TEntity> extends EntityItem<TEntity> {
    Of: EntitySet<TEntity>;
    constructor(Of: EntitySet<TEntity>);
    Take: TakeEntitySet<TEntity>;
    GetQueryString(): string;
}
export declare abstract class EntitySet<TEntity> extends EntityItem<TEntity> {
    abstract GetQueryString(): string;
    One(id?: number): SingleEntity<TEntity>;
    Take(number: number): TakeEntitySet<TEntity>;
    Where<TCondition>(query: (eachEnitity: TEntity & ITokenEntity) => EntitySet<TCondition>, conditionType?: {
        new (): TCondition;
    } | null): EntitySet<TEntity>;
}
export declare class SourceEntitySet<TEntity> extends EntityItem<TEntity> {
    Of: EntityItem<TEntity>;
    constructor(Of: EntityItem<TEntity>);
    static TokenIndex: number;
    static GetToken(): string;
    Token: ITokenEntity & TEntity;
    GetQueryString(): string;
}
export interface ITokenEntity extends IEntityQuery {
    Token: string;
}
export declare class TableEntitySet<TEntity extends object> extends EntitySet<TEntity> {
    constructor(entityType: {
        new (): TEntity;
    });
    GetQueryString(): string;
}
export declare class QueryEntitySet<TEntity, TReturn> extends EntitySet<TReturn> {
    From: EntityItem<TEntity>;
    Query: {
        (token: TEntity & ITokenEntity): EntityItem<TReturn>;
    };
    constructor(returnType: {
        new (): TReturn;
    }, From: EntityItem<TEntity>, Query: {
        (token: TEntity & ITokenEntity): EntityItem<TReturn>;
    });
    GetQueryString(): string;
}
export declare class TakeEntitySet<TEntity> extends EntitySet<TEntity> {
    From: EntitySet<TEntity>;
    TakeAmount: number;
    constructor(From: EntitySet<TEntity>, TakeAmount: number);
    Resourced: boolean;
    GetQueryString(): string;
    get IsTake(): boolean;
}
export declare class SelectEntitySet<TFromEntity, TToEntity> extends EntitySet<TToEntity> {
    From: EntityItem<TFromEntity>;
    Query: QueryEntitySet<TFromEntity, TToEntity>;
    constructor(returnType: {
        new (): TToEntity;
    }, From: EntityItem<TFromEntity>, Query: QueryEntitySet<TFromEntity, TToEntity>);
    FromSource: SourceEntitySet<TFromEntity>;
    GetQueryString(): string;
}
export declare class ReferenceEntitySet<TFromEntity extends object, TToEntity extends object> extends EntitySet<TToEntity> {
    From: EntitySet<TFromEntity>;
    FromColumn: string;
    ToColumn: string;
    constructor(From: EntitySet<TFromEntity>, FromColumn: string, toEntityType: {
        new (): TToEntity;
    }, ToColumn?: string);
    ToEntitySet: TableEntitySet<TToEntity>;
    GetQueryString(): string;
}
export declare class ConditionEntitySet<TEntity, TCondition> extends EntitySet<TEntity> {
    For: EntitySet<TEntity>;
    Condition: EntitySet<TCondition>;
    constructor(For: EntitySet<TEntity>, Condition: EntitySet<TCondition>);
    GetQueryString(): string;
    get IsWhere(): boolean;
}
export declare abstract class Column<TColumn extends boolean | number | string | null> implements IEntityQuery {
    GetColumn: {
        (): string;
    };
    constructor(GetColumn: {
        (): string;
    });
    GetQueryString(): string;
}
export declare class EntityColumn<TEntity, TColumn extends boolean | number | string | null = string> extends Column<TColumn> {
    Of: EntitySet<TEntity>;
    constructor(Of: EntitySet<TEntity>, getColumn: {
        (): string;
    });
    GetQueryString(): string;
}
export declare class FunctionEntityColumn<TEntity, TColumn extends boolean | number | string = number> extends EntityColumn<TEntity, TColumn> {
    Of: EntitySet<TEntity>;
    GetFunction: {
        (): string;
    };
    constructor(Of: EntitySet<TEntity>, GetFunction: {
        (): string;
    });
}
export declare class CountFunctionEntityColumn<TEntity> extends FunctionEntityColumn<TEntity, number> {
    Of: EntitySet<TEntity>;
    constructor(Of: EntitySet<TEntity>);
}
