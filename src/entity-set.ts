export class EntityConfig<TEntity extends EntityBase<TEntity>> {
    Table!: string;
    Mappings!: { [column: string]: { (token: TokenEntitySet<TEntity>): Column<boolean | number | string> }};
}


export abstract class EntityBase<TEntity extends EntityBase<TEntity>> {
    constructor () { }

    __Config!: EntityConfig<TEntity>;
}


export abstract class EntityItem<T> {
    abstract GetQueryString(): string;
}


export abstract class EntitySet<TEntity extends EntityBase<TEntity>> extends EntityItem<TEntity> {
    constructor (public EntityType: { new(): TEntity }) {
        super();

        this.Entity = new EntityType();
    }

    Entity: TEntity;

    _source!: SourceEntitySet<TEntity>;
    get Source(): SourceEntitySet<TEntity> {
        return this._source;
    }
    set Source(value: SourceEntitySet<TEntity>) {
        this._source = (value instanceof SourceEntitySet) && value || new SourceEntitySet(this.EntityType, this);
    }

    Where<TCondition extends EntityBase<TCondition>>(query: (eachEnitity: TokenEntitySet<TEntity>) => EntitySet<TCondition>, conditionType: { new(): TCondition } | null = null): EntitySet<TEntity> {
        var returnEntityType = conditionType == null
            ? query(new TokenEntitySet<TEntity>(this.EntityType, this.Source)).EntityType
            : conditionType;
            
        var queryEntitySet = new QueryEntitySet<TEntity, TCondition>(returnEntityType, this, query);

        return new ConditionEntitySet<TEntity, TCondition>(this.EntityType, this, queryEntitySet);
    }

    Select<TSelected extends EntityBase<TSelected>>(query: (eachEnitity: TokenEntitySet<TEntity>) => EntitySet<TSelected>, conditionType: { new(): TSelected } | null = null): EntitySet<TSelected> {
        var returnEntityType = conditionType == null
            ? query(new TokenEntitySet<TEntity>(this.EntityType, this.Source)).EntityType
            : conditionType;

        var queryEntitySet = new QueryEntitySet<TEntity, TSelected>(returnEntityType, this, query);

        return new SelectEntitySet<TEntity, TSelected>(returnEntityType, this, queryEntitySet);
    }
}


export class SourceEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }, public Of: EntitySet<TEntity>) {
        super (entityType);
        
        this.Token = new TokenEntitySet<TEntity>(entityType, this);
    }

    Token: TokenEntitySet<TEntity>;

    GetQueryString(): string {
        return this.Of.GetQueryString();
    }
}


export class TokenEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }, public Of: SourceEntitySet<TEntity>) {
        super(entityType);

        this.Token = TokenEntitySet.GetToken();
        this.Source = this.Of;
    }

    static TokenIndex: number;
    static GetToken(): string {
        return `A_${TokenEntitySet.TokenIndex++}`;
    }

    private Token: string;

    GetQueryString(): string {
        return this.Token;
    }
}


export class QueryEntitySet<TEntity extends EntityBase<TEntity>, TReturn extends EntityBase<TReturn>> extends EntitySet<TReturn> {
    constructor (returnType: { new(): TReturn }, public From: EntitySet<TEntity>, public Query: { (token: TokenEntitySet<TEntity>): EntitySet<TReturn> }) {
        super(returnType);
    }

    GetQueryString(): string {
        return this.Query(this.From.Source.Token).GetQueryString();
    }
}


export class TableEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }) {
        super(entityType);
    }

    GetQueryString() {
        return `SELECT * FROM ${this.Entity.__Config.Table} ${this.Source.Token.GetQueryString()}`;
    }
}


export class TakeEntitySet<TEntity extends EntityBase<TEntity>> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }, public From: EntitySet<TEntity>, public TakeAmount: number) {
        super(entityType);

        this.Source = From.Source;
    }

    GetQueryString(): string {
        let fromQueryString = this.From.GetQueryString();

        if (this.From instanceof TakeEntitySet) {
            return `${fromQueryString.substring(0, fromQueryString.lastIndexOf(' '))} ${this.TakeAmount}`;
        }

        return `${fromQueryString} LIMIT ${this.TakeAmount}`;
    }

    public get IsTake(): boolean {
        return true;
    }
}


export class SelectEntitySet<TFromEntity extends EntityBase<TFromEntity>, TToEntity extends EntityBase<TToEntity>> extends EntitySet<TToEntity> {
    constructor (returnType: { new(): TToEntity }, public From: EntitySet<TFromEntity>, public Query: QueryEntitySet<TFromEntity, TToEntity>) {
        super(returnType);

        this.FromSource = new SourceEntitySet<TFromEntity>(this.From.EntityType, this.From);
        this.Source = this.Query.Source;
    }

    FromSource: SourceEntitySet<TFromEntity>;

    GetQueryString(): string {
        return `WITH ${this.FromSource.Token.GetQueryString()} AS (${this.FromSource.GetQueryString()}) ${this.Query.Query(this.FromSource.Token).GetQueryString()}`;
    }
}


export class ReferenceEntitySet<TFromEntity extends EntityBase<TFromEntity>, TToEntity extends EntityBase<TToEntity>> extends EntitySet<TToEntity> {
    constructor (public From: EntitySet<TFromEntity>, public FromColumn: string, toEntityType: { new(): TToEntity }, public ToColumn: string = "Id") {
        super(toEntityType);

        this.ToEntitySet = new TableEntitySet<TToEntity>(toEntityType);
    }

    public ToEntitySet: TableEntitySet<TToEntity>;

    GetQueryString(): string {
        return `${this.ToEntitySet.GetQueryString()} WHERE ${this.ToColumn} IN (${this.From.GetQueryString()})`;
    }
}


export class ConditionEntitySet<TEntity extends EntityBase<TEntity>, TCondition extends EntityBase<TCondition>> extends EntitySet<TEntity> {
    constructor (entityType: { new(): TEntity }, public For: EntitySet<TEntity>, public Condition: EntitySet<TCondition>) {
        super(entityType);

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


export abstract class Column<TColumn extends boolean | number | string | null> extends EntityItem<TColumn> {
    constructor (public GetColumn: { (): string }) {
        super();
    }

    public abstract GetQueryString(): string;
}


export class EntityColumn<TEntity extends EntityBase<TEntity>, TColumn extends boolean | number | string | null = string> extends Column<TColumn> {
    constructor (public Of: EntitySet<TEntity>, getColumn: { (): string }) {
        super(getColumn);
    }

    GetQueryString(): string {
        return this.GetColumn();
    }
}


export class FunctionEntityColumn<TEntity extends EntityBase<TEntity>, TColumn extends boolean | number | string = number> extends EntityColumn<TEntity, TColumn> {
    constructor (public Of: EntitySet<TEntity>, public GetFunction: { (): string }) {
        super(Of, GetFunction);
    }
}


export class CountFunctionEntityColumn<TEntity extends EntityBase<TEntity>> extends FunctionEntityColumn<TEntity, number> {
    constructor (public Of: EntitySet<TEntity>) {
        super(Of, () => 'COUNT()');
    }
}