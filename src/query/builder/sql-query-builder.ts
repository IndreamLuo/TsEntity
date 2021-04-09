import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { ValueExpressionBase } from "../../expression/expressions/base/value-expression-base";
import { CalculateExpression } from "../../expression/expressions/component/calculate-expression";
import { ColumnExpression } from "../../expression/expressions/component/column-expression";
import { ConstantExpression } from "../../expression/expressions/component/constant-expression";
import { NotExpression } from "../../expression/expressions/component/not-expression";
import { VariableExpression } from "../../expression/expressions/component/variable-expression";
import { FilterExpression } from "../../expression/expressions/filter-expression";
import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { SourceExpression } from "../../expression/expressions/source-expression";
import { CalculationLexers } from "../../utilities/lexer/calculation-lexers";
import { Operator } from "../../utilities/types/operators";
import { ValueType } from "../../utilities/types/value-type";
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
    constructor() {}

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
            case FilterExpression:
                this.BuildQueryWithFilterExpression(sqlQuery, expression as FilterExpression<T>);
                break;
            default:
                throw new Error(`Method not implemented for ${expression.constructor.name}.`);
        }
    }

    BuildQueryWithSourceExpression<T>(sqlQuery: SqlQuery, sourceExpression: SourceExpression<T>) {
        let select = sqlQuery.CreateAndAddSelect(sourceExpression);

        select.SetFrom(sourceExpression);
        
        Object.values(sourceExpression.EntityDiagram.Columns).forEach(columnDiagram => {
            let column = select.From!.Column(columnDiagram);
            select.AddColumn(column);
        });
    }

    BuildQueryWithReferenceExpression<TFrom, TTo>(sqlQuery: SqlQuery, referenceExpression: ReferenceExpression<TFrom, TTo>) {
        this.BuildQueryWithExpression(sqlQuery, referenceExpression.From);

        let select = sqlQuery.GetLast() as Select;

        let relationshipDiagram = referenceExpression.Relationship;
        let toEntityDiagram = referenceExpression.Schema.GetOrAddEntity(relationshipDiagram.GetToType());
        let reverseRelationshipDiagram = toEntityDiagram.GetReserveRelationship(relationshipDiagram);

        select.Columns.forEach(column => {
            column.Alias = `${reverseRelationshipDiagram!.Name}.${column.Alias || column.Name}`;
        });

        let join = select.Join(referenceExpression);
        join.IsInner = true;
        
        Object.values(toEntityDiagram.Columns).forEach(columnDiagram => {
            let column = join.Joinee.Column(columnDiagram);
            column.Alias = columnDiagram.Name;

            select.AddColumn(column);
        });

        relationshipDiagram.PairingPattern.forEach(pairing => {
            let fromKey = select.Columns.find(column => column.Source === select.From && column.Name === pairing.FromKey)!;
            let toKey = select.Columns.find(column => column.Source === join.Joinee && column.Name === pairing.ToKey)!;

            let condition = new Calculation(join, Operator.EqualTo, fromKey, toKey);

            join.On = join.On
                ? new Calculation(join, Operator.And, join.On, condition)
                : condition;
        });
        if (select.Where) {
            join.On = new Calculation(join, Operator.And, join.On, select.Where);
            select.Where = undefined;
        }
    }

    BuildQueryWithFilterExpression<T>(sqlQuery: SqlQuery, filterExpression: FilterExpression<T>) {
        if (!sqlQuery.ExpressionStatementStack.HasStatementFor(filterExpression.From)) {
            this.BuildQueryWithExpression(sqlQuery, filterExpression.From);
        }

        let select = sqlQuery.GetLast() as Select;
        
        let condition = this.ConvertConditionExpressionToSqlStatement(select, filterExpression.Condition);
        if (!(condition instanceof Calculation)) {
            condition = new Calculation(select, Operator.Is, condition);
        }
        
        let existingCondition: Calculation | undefined = undefined;

        if (select.Where) {
            existingCondition = select.Where;
        } else if (select.Joins && select.Joins.length) {
            existingCondition = select.Joins[select.Joins.length - 1].On;
        }

        if (existingCondition) {
            existingCondition.Left = new Calculation(
                select,
                existingCondition.Operator,
                existingCondition.Left,
                existingCondition.Right
            );

            existingCondition.Operator = Operator.And;
            existingCondition.Right = condition;
        } else {
            select.Where = condition;
        }
    }

    ConvertConditionExpressionToSqlStatement<T>(parent: Select | Join, conditionExpression: ValueExpressionBase<T>): CalculationValue {
        switch (conditionExpression.constructor) {
            case ConstantExpression:
                return (conditionExpression as ConstantExpression<any>).Value as ValueType;
            case ColumnExpression:
                let columnExpression = conditionExpression as ColumnExpression<T, any>;
                let select = parent instanceof Select
                    ? parent
                    : parent.Select;
                let source = select.ExpressionStatementStack.GetStatement(columnExpression.Of) as Source<T>;
                return source.Column(columnExpression.Diagram);
            case NotExpression:
                let notExpression = conditionExpression as NotExpression<T>;
                return new Calculation(
                    parent,
                    Operator.Not,
                    this.ConvertConditionExpressionToSqlStatement(parent, notExpression.Of)
                );
            case VariableExpression:
                throw Error("VariableExpression related function not implemented.");
            case CalculateExpression:
                let calculateExpression = conditionExpression as CalculateExpression<any>;
                return new Calculation(
                    parent,
                    calculateExpression.Operator,
                    this.ConvertConditionExpressionToSqlStatement(parent, calculateExpression.LeftValue),
                    calculateExpression.RightValue
                        ? this.ConvertConditionExpressionToSqlStatement(parent, calculateExpression.RightValue)
                        : undefined
                );
        }

        throw Error("Not implemented.");
    }

    ConvertDateToString(date: Date) {
        return `'${date.getFullYear()}-${date.getMonth() < 9 ? 0 : ''}${date.getMonth() + 1}-${date.getDate()} ${date.getHours() < 10 ? 0 : ''}${date.getHours()}:${date.getMinutes() < 10 ? 0 : ''}${date.getMinutes()}:${date.getSeconds() < 10 ? 0 : ''}${date.getSeconds()}'`;
    }

    ConvertSourceToString(source: Source<any>) {
        let queryString;

        switch (source.Data.constructor) {
            case Table:
                queryString = (source.Data as Table<any>).Name;
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

    ConvertSelectToString(select: Select) {
        let columns = select.Columns
            .map(column => this.ConvertColumnToSelectString(column))
            .join(',');
        
        let from = select.From ? this.ConvertSourceToFromString(select.From) : '';

        let joins = select.Joins?.map(join => this.ConvertJoinToString(join)).join(' ');

        let where = select.Where ? this.ConvertWhereToString(select.Where) : '';

        return `SELECT ${columns}${from ? ` ${from}` : ''}${joins ? ` ${joins}` : ''}${where ? ` ${where}` : ''}`;
    }

    ConvertColumnToSelectString(column: Column<any>) {
        return `${this.ConvertColumnToString(column)}${column.Alias ? ` AS "${column.Alias}"` : ''}`;
    }

    ConvertColumnToString(column: Column<any>) {
        return column.Source && column.Source.Alias ? `${column.Source.Alias}.${column.Name}` : column.Name;
    }

    ConvertSourceToFromString(source: Source<any>) {
        return `FROM ${this.ConvertSourceToString(source)}`;
    }

    ConvertJoinToString(join: Join) {
        let joinee = this.ConvertSourceToString(join.Joinee);
        let condition = this.ConvertCalculationToStringAndPriority(join.On).String;

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

    ConvertWhereToString(condition: Calculation) {
        return `WHERE ${this.ConvertCalculationToStringAndPriority(condition).String}`;
    }

    ConvertCalculationToStringAndPriority(calculation: CalculationValue): { String: String, Priority: Number } {
        let result = { String: null as any as String, Priority: 0 };

        switch (calculation.constructor) {
            case String:
                result.String = `'${calculation}'`;
                break;
            case Boolean:
            case Number:
                result.String =  `${calculation}`;
                break;
            case Date:
                result.String = `${this.ConvertDateToString(calculation as Date)}`;
                break;
            case Column:
                result.String = this.ConvertColumnToString(calculation as Column<any>);
                break;
            case Calculation:
                calculation = calculation as Calculation;
                result.Priority = CalculationLexers.OperatorPriorities[calculation.Operator];
                
                let leftCalculation = this.ConvertCalculationToStringAndPriority(calculation.Left);
                let left = this.WrapCalculationStringIfLessPriority(leftCalculation, result.Priority);
                let rightCalculation = calculation.Right && this.ConvertCalculationToStringAndPriority(calculation.Right);
                let right = rightCalculation && this.WrapCalculationStringIfLessOrEqualPriority(rightCalculation, result.Priority);
                
                let operator: String = calculation.Operator;

                switch (calculation.Operator) {
                    case Operator.Not:
                        result.String = `NOT ${left}`;
                        break;
                    case Operator.Is:
                        result.String = left;
                        break;
                    case Operator.And:
                        operator = 'AND';
                        break;
                    case Operator.Or:
                        operator = 'OR';
                        break;
                    case Operator.EqualTo:
                        operator = '=';
                        break;
                }

                result.String = result.String || `${left} ${operator} ${right}`;

                break;
            default:
                throw new Error("Method not implemented.");
        }

        return result;
    }

    protected WrapCalculationStringIfLessPriority(calculationString: { String: String, Priority: Number }, parentPriority: Number) {
        if (calculationString.Priority < parentPriority) {
            return `(${calculationString.String})`;
        }

        return calculationString.String;
    }

    protected WrapCalculationStringIfLessOrEqualPriority(calculationString: { String: String, Priority: Number }, parentPriority: Number) {
        if (calculationString.Priority <= parentPriority) {
            return `(${calculationString.String})`;
        }

        return calculationString.String;
    }
}