import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { EntityDiagram } from "../../schema/entity-diagram";
import { Calculation } from "./calculation";
import { Column } from "./column";
import { ExpressionStatementStack } from "./expression-statement-stack";
import { Join } from "./join";
import { Source } from "./source";
import { SqlQuery } from "./sql-query";
import { SqlStatementBase } from "./sql-statement-base";
import { Table } from "./table";

export class Select extends SqlStatementBase {
    constructor (protected Parent: SqlQuery) {
        super(Parent);

        this.ExpressionStatementStack = new ExpressionStatementStack(Parent.ExpressionStatementStack);
    }

    ExpressionStatementStack: ExpressionStatementStack;

    Columns: Column<any>[] = [];
    From?: Source<any>;
    Joins?: Join[];
    Where?: Calculation;

    AddColumn(column: Column<any>) {
        this.Columns.push(column);
    }

    SetFrom(entityDiagram: EntityDiagram<any>) {
        if (this.From) {
            throw Error(`From already set with source [${this.From.Alias || this.From.Data.Name}].`);
        }

        this.From = new Table(this, entityDiagram).Source;

        return this.From;
    }

    Join(referenceExpression: ReferenceExpression<any, any>) {
        let toType = referenceExpression.Relationship.GetToType();
        let toEntityDiagram = referenceExpression.Schema.GetOrAddEntity(toType);

        let joinee = new Table(this, toEntityDiagram);
        let join = new Join(this, joinee.Source);
        this.Joins = this.Joins || [];
        this.Joins.push(join);

        this.ExpressionStatementStack.AddForExpressionStatement(referenceExpression, joinee.Source);

        return join;
    }
}