import { EntityDomain } from "./entity-domain";
export declare class EntityConfig<TEntity extends EntityBase<TEntity>> {
    Table: string;
    Mappings: {
        [column: string]: {
            (token: TokenEntitySet<TEntity>): Column<boolean | number | string>;
        };
    };
}
export declare abstract class EntityBase<TEntity extends EntityBase<TEntity>> {
    constructor();
    __Config: EntityConfig<TEntity>;
}
export declare abstract class EntitySet<TEntity extends EntityBase<TEntity>> extends EntityDomain {
    EntityType: {
        new (): TEntity;
    };
    constructor(EntityType: {
        new (): TEntity;
    });
    Entity: TEntity;
    _source: SourceEntitySet<TEntity>;
    get Source(): SourceEntitySet<TEntity>;
    set Source(value: SourceEntitySet<TEntity>);
    Where<TCondition extends EntityBase<TCondition>>(query: (eachEnitity: TokenEntitySet<TEntity>) => EntitySet<TCondition>, conditionType?: {
        new (): TCondition;
    } | null): EntitySet<TEntity>;
    Select<TSelected extends EntityBase<TSelected>>(query: (eachEnitity: TokenEntitySet<TEntity>) => EntitySet<TSelected>, conditionType?: {
        new (): TSelected;
    } | null): EntitySet<TSelected>;
}
export declare class SourceEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    Of: EntitySet<TEntity>;
    constructor(entityType: {
        new (): TEntity;
    }, Of: EntitySet<TEntity>);
    Token: TokenEntitySet<TEntity>;
    GetQueryString(): string;
}
export declare class TokenEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    Of: SourceEntitySet<TEntity>;
    constructor(entityType: {
        new (): TEntity;
    }, Of: SourceEntitySet<TEntity>);
    static TokenIndex: number;
    static GetToken(): string;
    private Token;
    GetQueryString(): string;
}
export declare class QueryEntitySet<TEntity extends EntityBase<TEntity>, TReturn extends EntityBase<TReturn>> extends EntitySet<TReturn> {
    From: EntitySet<TEntity>;
    Query: {
        (token: TokenEntitySet<TEntity>): EntitySet<TReturn>;
    };
    constructor(returnType: {
        new (): TReturn;
    }, From: EntitySet<TEntity>, Query: {
        (token: TokenEntitySet<TEntity>): EntitySet<TReturn>;
    });
    GetQueryString(): string;
}
export declare class TableEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    constructor(entityType: {
        new (): TEntity;
    });
    GetQueryString(): string;
}
export declare class TakeEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    From: EntitySet<TEntity>;
    TakeAmount: number;
    constructor(entityType: {
        new (): TEntity;
    }, From: EntitySet<TEntity>, TakeAmount: number);
    GetQueryString(): string;
    get IsTake(): boolean;
}
export declare class SelectEntitySet<TFromEntity extends EntityBase<TFromEntity>, TToEntity extends EntityBase<TToEntity>> extends EntitySet<TToEntity> {
    From: EntitySet<TFromEntity>;
    Query: QueryEntitySet<TFromEntity, TToEntity>;
    constructor(returnType: {
        new (): TToEntity;
    }, From: EntitySet<TFromEntity>, Query: QueryEntitySet<TFromEntity, TToEntity>);
    FromSource: SourceEntitySet<TFromEntity>;
    GetQueryString(): string;
}
export declare class ReferenceEntitySet<TFromEntity extends EntityBase<TFromEntity>, TToEntity extends EntityBase<TToEntity>> extends EntitySet<TToEntity> {
    From: EntitySet<TFromEntity>;
    FromColumn: string;
    ToColumn: string;
    constructor(From: EntitySet<TFromEntity>, FromColumn: string, toEntityType: {
        new (): TToEntity;
    }, ToColumn?: string);
    ToEntitySet: TableEntitySet<TToEntity>;
    GetQueryString(): string;
}
export declare class ConditionEntitySet<TEntity extends EntityBase<TEntity>, TCondition extends EntityBase<TCondition>> extends EntitySet<TEntity> {
    For: EntitySet<TEntity>;
    Condition: EntitySet<TCondition>;
    constructor(entityType: {
        new (): TEntity;
    }, For: EntitySet<TEntity>, Condition: EntitySet<TCondition>);
    GetQueryString(): string;
    get IsWhere(): boolean;
}
export declare abstract class Column<TColumn extends boolean | number | string | null> extends EntityDomain {
    GetColumn: {
        (): string;
    };
    constructor(GetColumn: {
        (): string;
    });
    abstract GetQueryString(): string;
}
export declare class EntityColumn<TEntity extends EntityBase<TEntity>, TColumn extends boolean | number | string | null = string> extends Column<TColumn> {
    Of: EntitySet<TEntity>;
    constructor(Of: EntitySet<TEntity>, getColumn: {
        (): string;
    });
    GetQueryString(): string;
}
export declare class FunctionEntityColumn<TEntity extends EntityBase<TEntity>, TColumn extends boolean | number | string = number> extends EntityColumn<TEntity, TColumn> {
    Of: EntitySet<TEntity>;
    GetFunction: {
        (): string;
    };
    constructor(Of: EntitySet<TEntity>, GetFunction: {
        (): string;
    });
}
export declare class CountFunctionEntityColumn<TEntity extends EntityBase<TEntity>> extends FunctionEntityColumn<TEntity, number> {
    Of: EntitySet<TEntity>;
    constructor(Of: EntitySet<TEntity>);
}
