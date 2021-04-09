import { ExpressionBase } from "../../expression/expressions/base/expression-base";
import { NumberDictionary } from "../../utilities/types/dictionaries";
import { SqlStatementBase } from "./sql-statement-base";

export class ExpressionStatementStack {
    constructor(public LastStack: ExpressionStatementStack | undefined = undefined) {}

    ExpressionStatements: NumberDictionary<SqlStatementBase> = {};

    AddForExpressionStatement(expression: ExpressionBase, sqlStatement: SqlStatementBase) {
        this.ExpressionStatements[expression.Id] = sqlStatement;
    }

    GetStatement(expressionId: Number): SqlStatementBase | undefined
    GetStatement(expression: ExpressionBase): SqlStatementBase | undefined
    GetStatement(key: Number | ExpressionBase) {
        if (typeof(key) != 'number') {
            key = (key as ExpressionBase).Id;
        }

        return this.ExpressionStatements[key as number]
            || this.LastStack?.GetStatement(key);
    }

    HasStatementFor(expression: ExpressionBase): Boolean {
        return !!this.ExpressionStatements[expression.Id] || this.LastStack?.HasStatementFor(expression);
    }
}