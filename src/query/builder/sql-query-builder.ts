import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { SourceExpression } from "../../expression/expressions/source-expression";
import { Schema } from "../../schema/schema";
import { Operator } from "../../utilities/types/operators";
import { QueryPlan } from "../plan/query-plan";
import { Calculation, CalculationValue } from "../sqls/calculation";
import { Column } from "../sqls/column";
import { Join } from "../sqls/join";
import { Select } from "../sqls/select";
import { Source } from "../sqls/source";
import { SqlQuery } from "../sqls/sql-query";
import { Table } from "../sqls/table";
import { QueryBuilder } from "./query-builder";

export abstract class SqlQueryBuilder implements QueryBuilder {
    constructor(public Schema: Schema) {}

    BuildQuery(queryPlan: QueryPlan): SqlQuery {
        let query = new SqlQuery(queryPlan);

        query.QueryPlan.StagingExpressions.forEach(expression => this.BuildQueryWithExpression(query, expression));

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

    BuildQueryWithExpression<T>(sqlQuery: SqlQuery, expression: ExpressionBase) {
        switch (expression.constructor) {
            case SourceExpression:
                this.BuildQueryWithSourceExpression(sqlQuery, expression as SourceExpression<T>);
                break;
            case ReferenceExpression:
                this.BuildQueryWithReferenceExpression(sqlQuery, expression as ReferenceExpression<any, T>);
                break;
            default:
                throw new Error("Method not implemented.");
        }
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

        sqlQuery.AddSubQuery(select);
    }

    BuildQueryWithReferenceExpression<TFrom, TTo>(sqlQuery: SqlQuery, referenceExpression: ReferenceExpression<TFrom, TTo>) {
        this.BuildQueryWithExpression(sqlQuery, referenceExpression.From);

        let select: Select;
        if (!sqlQuery.SubQueries.length || !(sqlQuery.SubQueries[sqlQuery.SubQueries.length - 1] instanceof Select)) {
            sqlQuery.AddSubQuery(new Select(), referenceExpression);
        }
        select = sqlQuery.SubQueries[sqlQuery.SubQueries.length - 1] as Select;

        let relationshipDiagram = referenceExpression.Relationship;
        let fromEntityDiagram = relationshipDiagram.From;
        let toEntityDiagram = this.Schema.GetOrAddEntity(relationshipDiagram.GetToType());
        let reverseRelationshipDiagram = toEntityDiagram.GetReserveRelationship(relationshipDiagram);

        select.Columns.forEach(column => {
            column.Alias = `${reverseRelationshipDiagram!.Name}.${column.Alias || column.Name}`;
        });

        let from = new Source(new Table(toEntityDiagram.Name));
        
        Object.values(toEntityDiagram.Columns).forEach(columnDiagram => {
            let column = new Column(columnDiagram.Name);
            column.Source = from;
            column.Alias = columnDiagram.Name;

            select.Columns.push(column);
        });

        let join = new Join(new Source(new Table(fromEntityDiagram.Name)));
        join.IsLeft = true;
        join.Joinee = select.From as Source;
        select.From = from;

        relationshipDiagram.PairingPattern.forEach(pairing => {
            let fromId = select.Columns.find(column => column.Source === join.Joinee && column.Name === pairing.FromKey)!;
            let toId = select.Columns.find(column => column.Source === select.From && column.Name === pairing.ToKey)!;

            let condition = new Calculation(
                Operator.EqualTo,
                fromId,
                toId
            );

            join.On = join.On
                ? new Calculation(Operator.And, join.On, condition)
                : condition;
        });

        join.Joinee.Alias = join.Joinee.Alias || fromEntityDiagram.Name.toLocaleLowerCase();
        select.From.Alias = select.From.Alias || toEntityDiagram.Name.toLocaleLowerCase();
        select.JOINs.unshift(join);
    }

    ConvertSelectToString(select: Select) {
        let columns = select.Columns
            .map(column => this.ConvertColumnToSelectString(column))
            .join(',');
        
        let from = select.From ? this.ConvertSourceToFromString(select.From) : '';

        let joins = select.JOINs.map(join => this.ConvertJoinToString(join)).join(' ');

        return `SELECT ${columns}${from ? ` ${from}` : ''}${joins ? ` ${joins}` : ''}`;
    }

    ConvertColumnToSelectString(column: Column) {
        return `${this.ConvertColumnToString(column)}${column.Alias ? ` AS "${column.Alias}"` : ''}`;
    }

    ConvertColumnToString(column: Column) {
        return column.Source && column.Source.Alias ? `${column.Source.Alias}.${column.Name}` : column.Name;
    }

    ConvertSourceToFromString(source: Source) {
        return `FROM ${this.ConvertSourceToString(source)}`;
    }

    ConvertJoinToString(join: Join) {
        let joinee = this.ConvertSourceToString(join.Joinee);
        let condition = this.ConvertCalculationToString(join.On);

        if (join.IsInner) {
            if (join.IsLeft === undefined) {
                return `INNER JOIN ${joinee} ON ${condition}`;
            }
        } else {
            if (join.IsLeft) {
                return `LEFT OUTER JOIN ${joinee} ON ${condition}`;
            } else if (join.IsLeft === false) {
                return `RIGHT OUTER JOIN ${joinee} ON ${condition}`;
            } else {
                return `FULL OUTER JOIN ${joinee} ON ${condition}`;
            }
        }
        
        throw new Error("Method not implemented.");
    }

    ConvertSourceToString(source: Source) {
        let queryString;

        switch (source.Data.constructor) {
            case Table:
                queryString = (source.Data as Table).Name;
                break;
            default:
                throw new Error("Method not implemented.");
        }

        if (source.Alias) {
            queryString = (source.Data instanceof Table)
                ? `${queryString} ${source.Alias}`
                : `(${queryString}) ${source.Alias}`;
        }

        return queryString;
    }

    ConvertCalculationToString(calculation: CalculationValue): string {
        switch (calculation.constructor) {
            case String:
                return `"${calculation}"`;
            case Boolean:
            case Number:
                return `${calculation}`;
            case Date:
                return `"${this.ConvertDateToString(calculation as Date)}"`;
            case Column:
                return this.ConvertColumnToString(calculation as Column);
            case Calculation:
                calculation = calculation as Calculation;
                if (calculation.Operator === Operator.Not) {
                    let notCalculation = calculation.Left as Calculation;
                    if (notCalculation.Operator === Operator.And || notCalculation.Operator === Operator.Or) {
                        return `NOT (${this.ConvertCalculationToString(notCalculation)})`;
                    }
                    return `NOT ${this.ConvertCalculationToString(notCalculation)}`;
                } else if (calculation.Operator === Operator.EqualTo) {
                    return `${this.ConvertCalculationToString(calculation.Left)}=${this.ConvertCalculationToString(calculation.Right!)}`;
                } else if (calculation.Right !== undefined) {
                    return `${this.ConvertCalculationToString(calculation.Left)}${calculation.Operator}${this.ConvertCalculationToString(calculation.Right)}`;
                }
        }

        throw new Error("Method not implemented.");
    }

    ConvertDateToString(date: Date) {
        return `${date.getFullYear()}-${date.getMonth() < 9 ? 0 : ''}${date.getMonth() + 1}-${date.getDate()} ${date.getHours() < 10 ? 0 : ''}${date.getHours()}:${date.getMinutes() < 10 ? 0 : ''}${date.getMinutes()}:${date.getSeconds() < 10 ? 0 : ''}${date.getSeconds()}`;
    }
}