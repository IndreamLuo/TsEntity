"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityConfig {
}
exports.EntityConfig = EntityConfig;
class EntityBase {
    constructor() { }
}
exports.EntityBase = EntityBase;
class EntityItem {
}
exports.EntityItem = EntityItem;
class EntitySet extends EntityItem {
    constructor(EntityType) {
        super();
        this.EntityType = EntityType;
        this.Entity = new EntityType();
    }
    get Source() {
        return this._source;
    }
    set Source(value) {
        this._source = (value instanceof SourceEntitySet) && value || new SourceEntitySet(this.EntityType, this);
    }
    Where(query, conditionType = null) {
        var returnEntityType = conditionType == null
            ? query(new TokenEntitySet(this.EntityType, this.Source)).EntityType
            : conditionType;
        var queryEntitySet = new QueryEntitySet(returnEntityType, this, query);
        return new ConditionEntitySet(this.EntityType, this, queryEntitySet);
    }
    Select(query, conditionType = null) {
        var returnEntityType = conditionType == null
            ? query(new TokenEntitySet(this.EntityType, this.Source)).EntityType
            : conditionType;
        var queryEntitySet = new QueryEntitySet(returnEntityType, this, query);
        return new SelectEntitySet(returnEntityType, this, queryEntitySet);
    }
}
exports.EntitySet = EntitySet;
class SourceEntitySet extends EntitySet {
    constructor(entityType, Of) {
        super(entityType);
        this.Of = Of;
        this.Token = new TokenEntitySet(entityType, this);
    }
    GetQueryString() {
        return this.Of.GetQueryString();
    }
}
exports.SourceEntitySet = SourceEntitySet;
class TokenEntitySet extends EntitySet {
    constructor(entityType, Of) {
        super(entityType);
        this.Of = Of;
        this.Token = TokenEntitySet.GetToken();
        this.Source = this.Of;
    }
    static GetToken() {
        return `A_${TokenEntitySet.TokenIndex++}`;
    }
    GetQueryString() {
        return this.Token;
    }
}
exports.TokenEntitySet = TokenEntitySet;
class QueryEntitySet extends EntitySet {
    constructor(returnType, From, Query) {
        super(returnType);
        this.From = From;
        this.Query = Query;
    }
    GetQueryString() {
        return this.Query(this.From.Source.Token).GetQueryString();
    }
}
exports.QueryEntitySet = QueryEntitySet;
class TableEntitySet extends EntitySet {
    constructor(entityType) {
        super(entityType);
    }
    GetQueryString() {
        return `SELECT * FROM ${this.Entity.__Config.Table} ${this.Source.Token.GetQueryString()}`;
    }
}
exports.TableEntitySet = TableEntitySet;
class TakeEntitySet extends EntitySet {
    constructor(entityType, From, TakeAmount) {
        super(entityType);
        this.From = From;
        this.TakeAmount = TakeAmount;
        this.Source = From.Source;
    }
    GetQueryString() {
        let fromQueryString = this.From.GetQueryString();
        if (this.From instanceof TakeEntitySet) {
            return `${fromQueryString.substring(0, fromQueryString.lastIndexOf(' '))} ${this.TakeAmount}`;
        }
        return `${fromQueryString} LIMIT ${this.TakeAmount}`;
    }
    get IsTake() {
        return true;
    }
}
exports.TakeEntitySet = TakeEntitySet;
class SelectEntitySet extends EntitySet {
    constructor(returnType, From, Query) {
        super(returnType);
        this.From = From;
        this.Query = Query;
        this.FromSource = new SourceEntitySet(this.From.EntityType, this.From);
        this.Source = this.Query.Source;
    }
    GetQueryString() {
        return `WITH ${this.FromSource.Token.GetQueryString()} AS (${this.FromSource.GetQueryString()}) ${this.Query.Query(this.FromSource.Token).GetQueryString()}`;
    }
}
exports.SelectEntitySet = SelectEntitySet;
class ReferenceEntitySet extends EntitySet {
    constructor(From, FromColumn, toEntityType, ToColumn = "Id") {
        super(toEntityType);
        this.From = From;
        this.FromColumn = FromColumn;
        this.ToColumn = ToColumn;
        this.ToEntitySet = new TableEntitySet(toEntityType);
    }
    GetQueryString() {
        return `${this.ToEntitySet.GetQueryString()} WHERE ${this.ToColumn} IN (${this.From.GetQueryString()})`;
    }
}
exports.ReferenceEntitySet = ReferenceEntitySet;
class ConditionEntitySet extends EntitySet {
    constructor(entityType, For, Condition) {
        super(entityType);
        this.For = For;
        this.Condition = Condition;
        this.Source = this.For.Source;
    }
    GetQueryString() {
        let forQueryString = this.For.GetQueryString();
        if (this.For.constructor.name == this.constructor.name
            || this.For.constructor.name == 'ReferenceEntitySet') {
            return `${forQueryString} AND (${this.Condition.GetQueryString()})`;
        }
        return `${forQueryString} WHERE (${this.Condition.GetQueryString()})`;
    }
    get IsWhere() {
        return true;
    }
}
exports.ConditionEntitySet = ConditionEntitySet;
class Column extends EntityItem {
    constructor(GetColumn) {
        super();
        this.GetColumn = GetColumn;
    }
}
exports.Column = Column;
class EntityColumn extends Column {
    constructor(Of, getColumn) {
        super(getColumn);
        this.Of = Of;
    }
    GetQueryString() {
        return this.GetColumn();
    }
}
exports.EntityColumn = EntityColumn;
class FunctionEntityColumn extends EntityColumn {
    constructor(Of, GetFunction) {
        super(Of, GetFunction);
        this.Of = Of;
        this.GetFunction = GetFunction;
    }
}
exports.FunctionEntityColumn = FunctionEntityColumn;
class CountFunctionEntityColumn extends FunctionEntityColumn {
    constructor(Of) {
        super(Of, () => 'COUNT()');
        this.Of = Of;
    }
}
exports.CountFunctionEntityColumn = CountFunctionEntityColumn;
