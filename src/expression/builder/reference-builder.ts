import { Schema } from "../../schema/schema";
import { Assure } from "../../utilities/assure";
import { SelectFieldExpression } from "../../utilities/lexer/expressions/select-field-expression";
import { LambdaLexers } from "../../utilities/lexer/lambda-lexers";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { ReferenceExpression } from "../expressions/reference-expression";

declare module '../expressions/base/entity-expression-base' {
    interface EntityExpressionBase<T> {
        Reference<TTo>(to: (from: T) => TTo | TTo[]): ReferenceExpression<T, TTo>;
    }
}

EntityExpressionBase.prototype.Reference = function <T, TTo>(to: (from: T) => TTo | TTo[]) {
    let entityDiagram = Schema.Base.GetOrAddEntity(this.EntityConstructor);
    
    let toExpression = to.toString();
    let expressionTreeNode = LambdaLexers.SelectFieldLambda.Parse(toExpression);

    Assure.AreNotEqual(typeof(expressionTreeNode.Expression), 'string', () => 'Cannot self-reference.');

    let toFieldName = (expressionTreeNode.Expression as SelectFieldExpression).Field;

    let relationship = Schema.Base.Relationships[entityDiagram.Name][toFieldName];

    let toEntity = Schema.Base.GetOrAddEntity(relationship.GetToType());

    return new ReferenceExpression(toEntity.Constructor, this, relationship);
}
