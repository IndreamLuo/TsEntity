import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { SourceExpression } from "../../expression/expressions/source-expression";
import { Schema } from "../../schema/schema";
import { Column } from "../sqls/column";
import { Select } from "../sqls/select";
import { Source } from "../sqls/source";
import { SqlQuery } from "../sqls/sql-query";
import { Table } from "../sqls/table";
import { QueryBuilder } from "./query-builder";

export abstract class SqlQueryBuilder implements QueryBuilder {
    constructor(public Schema: Schema) {}

    BuildQuery<T>(expression: ExpressionBase): SqlQuery {
        let query = new SqlQuery();

        switch (expression.constructor) {
            case SourceExpression:
                this.BuildQueryWithSourceExpression(query, expression as SourceExpression<T>);
                break;
            default:
                throw new Error("Method not implemented.");
        }

        return query;
    }

    BuildQueryString(query: SqlQuery): string {
        return (query as SqlQuery).SubQueries
            .map(subQuery => {
                switch (subQuery.constructor) {
                    case Select:
                        return this.ConvertSelectToString(subQuery as Select);
                }
            })
            .join(' ');
    }

    BuildQueryWithSourceExpression<T>(sqlQuery: SqlQuery, sourceExpression: SourceExpression<T>) {
        let select = new Select();

        let entityDiagram = this.Schema.GetOrAddEntity(sourceExpression.EntityConstructor);

        select.From = new Source(new Table(entityDiagram.Name));
        
        Object.values(entityDiagram.Columns).forEach(columnDiagram => {
            let column = new Column(columnDiagram.Name);
            column.Source = select.From;

            select.Columns.push(column);
        });

        sqlQuery.SubQueries.push(select);
    }

    ConvertSourceToStringWihoutAlias(source: Source) {
        switch (source.Data.constructor) {
            case Table:
                return (source.Data as Table).Name;
        }
        
        throw new Error("Method not implemented.");
    }

    ConvertSelectToString(select: Select) {
        let columns = select.Columns
            .map(column => this.ConvertColumnToString(column))
            .join(',');
        
        let from = select.From ? this.ConvertSourceToFromString(select.From) : '';

        return `SELECT ${columns}${from ? ` ${from}` : ''}`;
    }

    ConvertColumnToString(column: Column) {
        return `${column.Source && column.Source.Alias ? `${column.Source.Alias}.` : ''}${column.Name}${column.Alias ? ` AS ${column.Alias}` : ''}`;
    }

    ConvertSourceToFromString(source: Source) {
        let from  = `FROM ${source.Data.constructor == Table
            ? this.ConvertSourceToStringWihoutAlias(source)
            : `(${this.ConvertSourceToStringWihoutAlias(source)})`}`;

        if (source.Alias) {
            from = `${from} ${source.Alias}`;
        }

        return from;
    }
}