import { Schema } from "../../schema/schema";
import { Assure } from "../../utilities/assure";
import { SelectFieldExpression } from "../../utilities/lexer/expressions/select-field-expression";
import { LambdaLexers } from "../../utilities/lexer/lambda-lexers";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { ReferenceExpression } from "../expressions/reference-expression";

declare module '../expressions/base/entity-expression-base' {
    interface EntityExpressionBase<T> {
        Reference<TTo>(to: (from: T) => TTo | TTo[]): ReferenceExpression<any, TTo>;
    }
}

EntityExpressionBase.prototype.Reference = function <T, TTo>(to: (from: T) => TTo | TTo[]) {
    let toExpression = to.toString();
    let expressionTreeNode = LambdaLexers.SelectFieldLambda.Parse(toExpression);

    Assure.AreNotEqual(typeof(expressionTreeNode.Expression), 'string', () => 'Cannot self-reference.');

    let selectFieldExpression = expressionTreeNode.Expression as SelectFieldExpression;
    let references = [];

    while (typeof(selectFieldExpression) !== 'string') {
        references.unshift(selectFieldExpression.Field);
        selectFieldExpression = selectFieldExpression.Identifier as SelectFieldExpression;
    }

    let entityDiagram = Schema.Base.GetOrAddEntity(this.EntityConstructor);
    let from = this;
    references.forEach(reference => {
        let relationship = Schema.Base.Relationships[entityDiagram.Name][reference];
        let toEntity = Schema.Base.GetOrAddEntity(relationship.GetToType());
        from = new ReferenceExpression(toEntity.Constructor, from, relationship);
        entityDiagram = Schema.Base.GetOrAddEntity(relationship.GetToType());
    });

    return from! as ReferenceExpression<T, TTo>;
}
