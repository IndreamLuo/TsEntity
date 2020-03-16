export class EntityConfig<TEntity> {
    Table!: string;
    Mappings!: { [column: string]: { (token: TEntity & ITokenEntity): Column<boolean | number | string> }};
}


export interface IEntityQuery {
    GetQueryString(): string;
}


export abstract class EntityItem<TEntity> implements IEntityQuery {
    constructor (public EntityType: { new(): TEntity }) {
        this.Entity = new EntityType();
    }

    Entity: TEntity;

    Source?: SourceEntitySet<TEntity>;

    abstract GetQueryString(): string;

    Select<TSelected>(query: (eachEnitity: TEntity & ITokenEntity) => EntitySet<TSelected>, conditionType: { new(): TSelected } | null = null): EntitySet<TSelected> {
        var returnEntityType = conditionType == null
            ? query(this.Source!.Token).EntityType
            : conditionType;

        var queryEntitySet = new QueryEntitySet<TEntity, TSelected>(returnEntityType, this, query);

        return new SelectEntitySet<TEntity, TSelected>(returnEntityType, this, queryEntitySet);
    }
}


export class SingleEntity<TEntity> extends EntityItem<TEntity> {
    constructor (public Of: EntitySet<TEntity>) {
        super(Of.EntityType);

        this.Take = this.Of.Take(1);
        this.Source = this.Take.Source;
    }

    Take: TakeEntitySet<TEntity>;

    GetQueryString(): string {
        return this.Take.GetQueryString();
    }
}


export abstract class EntitySet<TEntity> extends EntityItem<TEntity> {
    abstract GetQueryString(): string;

    One(id?: number): SingleEntity<TEntity> {
        return new SingleEntity(this);
    }

    Take(number: number): TakeEntitySet<TEntity> {
        return new TakeEntitySet(this, number);
    }

    Where<TCondition>(query: (eachEnitity: TEntity & ITokenEntity) => EntitySet<TCondition>, conditionType: { new(): TCondition } | null = null): EntitySet<TEntity> {
        var returnEntityType = conditionType == null
            ? query(this.Source!.Token).EntityType
            : conditionType;
            
        var queryEntitySet = new QueryEntitySet<TEntity, TCondition>(returnEntityType, this, query);

        return new ConditionEntitySet<TEntity, TCondition>(this, queryEntitySet);
    }
}


export class SourceEntitySet<TEntity> extends EntityItem<TEntity> {
    constructor (public Of: EntityItem<TEntity>) {
        super (Of.EntityType);
        
        this.Token = new this.EntityType() as unknown as TEntity & ITokenEntity;
        this.Token.Token = SourceEntitySet.GetToken();
        this.Token.GetQueryString = function () {
            return this.Token;
        }
    }

    static TokenIndex: number;
    static GetToken(): string {
        return `A_${SourceEntitySet.TokenIndex++}`;
    }

    Token: ITokenEntity & TEntity;

    GetQueryString(): string {
        return this.Of.GetQueryString();
    }
}


export interface ITokenEntity extends IEntityQuery {
    Token: string;
}


export class TableEntitySet<TEntity extends object> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }) {
        super(entityType);

        this.Source = new SourceEntitySet(this);
    }

    GetQueryString() {
        var token = this.Source!.Token.GetQueryString();
        
        return `SELECT * FROM ${this.Entity.constructor.name} ${token}`;
    }
}


export class QueryEntitySet<TEntity, TReturn> extends EntitySet<TReturn> {
    constructor (returnType: { new(): TReturn }, public From: EntityItem<TEntity>, public Query: { (token: TEntity & ITokenEntity): EntityItem<TReturn> }) {
        super(returnType);
    }

    GetQueryString(): string {
        return this.Query(this.From.Source!.Token).GetQueryString();
    }
}


export class TakeEntitySet<TEntity> extends EntitySet<TEntity> {
    constructor (public From: EntitySet<TEntity>, public TakeAmount: number) {
        super(From.EntityType);

        if (!(From instanceof TableEntitySet)) {
            this.Source = new SourceEntitySet(this.From);
            this.Resourced = true;
        } else {
            this.Source = From.Source;
        }
    }

    Resourced = false;

    GetQueryString(): string {
        let source = this.Source!.GetQueryString();

        if (this.Resourced) {
            return `SELECT * FROM (${source}) ${this.Source!.Token.GetQueryString()} LIMIT ${this.TakeAmount}`;
        }

        return `${source} LIMIT ${this.TakeAmount}`;
    }

    public get IsTake(): boolean {
        return true;
    }
}


export class SelectEntitySet<TFromEntity, TToEntity> extends EntitySet<TToEntity> {
    constructor (returnType: { new(): TToEntity }, public From: EntityItem<TFromEntity>, public Query: QueryEntitySet<TFromEntity, TToEntity>) {
        super(returnType);

        this.FromSource = new SourceEntitySet<TFromEntity>(this.From);
        this.Source = this.Query.Source;
    }

    FromSource: SourceEntitySet<TFromEntity>;

    GetQueryString(): string {
        return `WITH ${this.FromSource.Token.GetQueryString()} AS (${this.FromSource.GetQueryString()}) ${this.Query.Query(this.FromSource.Token).GetQueryString()}`;
    }
}


export class ReferenceEntitySet<TFromEntity extends object, TToEntity extends object> extends EntitySet<TToEntity> {
    constructor (public From: EntitySet<TFromEntity>, public FromColumn: string, toEntityType: { new(): TToEntity }, public ToColumn: string = "Id") {
        super(toEntityType);

        this.ToEntitySet = new TableEntitySet<TToEntity>(toEntityType);
    }

    public ToEntitySet: TableEntitySet<TToEntity>;

    GetQueryString(): string {
        return `${this.ToEntitySet.GetQueryString()} WHERE ${this.ToColumn} IN (${this.From.GetQueryString()})`;
    }
}


export class ConditionEntitySet<TEntity, TCondition> extends EntitySet<TEntity> {
    constructor (public For: EntitySet<TEntity>, public Condition: EntitySet<TCondition>) {
        super(For.EntityType);

        this.Source = this.For.Source;
    }

    GetQueryString(): string {
        let forQueryString = this.For.GetQueryString();

        if (this.For.constructor.name == this.constructor.name
            || this.For.constructor.name == 'ReferenceEntitySet') {
            return `${forQueryString} AND (${this.Condition.GetQueryString()})`;
        }

        return `${forQueryString} WHERE (${this.Condition.GetQueryString()})`;
    }

    public get IsWhere(): boolean {
        return true;
    }
}


export abstract class Column<TColumn extends boolean | number | string | null> implements IEntityQuery {
    constructor (public GetColumn: { (): string }) {
        
    }

    public GetQueryString(): string {
        return this.GetColumn();
    }
}


export class EntityColumn<TEntity, TColumn extends boolean | number | string | null = string> extends Column<TColumn> {
    constructor (public Of: EntitySet<TEntity>, getColumn: { (): string }) {
        super(getColumn);
    }

    GetQueryString(): string {
        return this.GetColumn();
    }
}


export class FunctionEntityColumn<TEntity, TColumn extends boolean | number | string = number> extends EntityColumn<TEntity, TColumn> {
    constructor (public Of: EntitySet<TEntity>, public GetFunction: { (): string }) {
        super(Of, GetFunction);
    }
}


export class CountFunctionEntityColumn<TEntity> extends FunctionEntityColumn<TEntity, number> {
    constructor (public Of: EntitySet<TEntity>) {
        super(Of, () => 'COUNT()');
    }
}