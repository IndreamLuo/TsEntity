"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityConfig {
}
exports.EntityConfig = EntityConfig;
class EntityItem {
    constructor(EntityType) {
        this.EntityType = EntityType;
        this.Entity = new EntityType();
    }
    Select(query, conditionType = null) {
        var returnEntityType = conditionType == null
            ? query(this.Source.Token).EntityType
            : conditionType;
        var queryEntitySet = new QueryEntitySet(returnEntityType, this, query);
        return new SelectEntitySet(returnEntityType, this, queryEntitySet);
    }
}
exports.EntityItem = EntityItem;
class SingleEntity extends EntityItem {
    constructor(Of) {
        super(Of.EntityType);
        this.Of = Of;
        this.Take = this.Of.Take(1);
        this.Source = this.Take.Source;
    }
    GetQueryString() {
        return this.Take.GetQueryString();
    }
}
exports.SingleEntity = SingleEntity;
class EntitySet extends EntityItem {
    One(id) {
        return new SingleEntity(this);
    }
    Take(number) {
        return new TakeEntitySet(this, number);
    }
    Where(query, conditionType = null) {
        var returnEntityType = conditionType == null
            ? query(this.Source.Token).EntityType
            : conditionType;
        var queryEntitySet = new QueryEntitySet(returnEntityType, this, query);
        return new ConditionEntitySet(this, queryEntitySet);
    }
}
exports.EntitySet = EntitySet;
class SourceEntitySet extends EntityItem {
    constructor(Of) {
        super(Of.EntityType);
        this.Of = Of;
        this.Token = new this.EntityType();
        this.Token.Token = SourceEntitySet.GetToken();
        this.Token.GetQueryString = function () {
            return this.Token;
        };
    }
    static GetToken() {
        return `A_${SourceEntitySet.TokenIndex++}`;
    }
    GetQueryString() {
        return this.Of.GetQueryString();
    }
}
exports.SourceEntitySet = SourceEntitySet;
class TableEntitySet extends EntitySet {
    constructor(entityType) {
        super(entityType);
        this.Source = new SourceEntitySet(this);
    }
    GetQueryString() {
        var token = this.Source.Token.GetQueryString();
        return `SELECT * FROM ${this.Entity.constructor.name} ${token}`;
    }
}
exports.TableEntitySet = TableEntitySet;
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
class TakeEntitySet extends EntitySet {
    constructor(From, TakeAmount) {
        super(From.EntityType);
        this.From = From;
        this.TakeAmount = TakeAmount;
        this.Resourced = false;
        if (!(From instanceof TableEntitySet)) {
            this.Source = new SourceEntitySet(this.From);
            this.Resourced = true;
        }
        else {
            this.Source = From.Source;
        }
    }
    GetQueryString() {
        let source = this.Source.GetQueryString();
        if (this.Resourced) {
            return `SELECT * FROM (${source}) ${this.Source.Token.GetQueryString()} LIMIT ${this.TakeAmount}`;
        }
        return `${source} LIMIT ${this.TakeAmount}`;
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
        this.FromSource = new SourceEntitySet(this.From);
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
    constructor(For, Condition) {
        super(For.EntityType);
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
class Column {
    constructor(GetColumn) {
        this.GetColumn = GetColumn;
    }
    GetQueryString() {
        return this.GetColumn();
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
