import { Schema } from "../../../schema/schema";
import { ExpressionTreeNode } from "../../../utilities/lexer/expression-tree-node";
import { LambdaLexers } from "../../../utilities/lexer/lambda-lexers";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { ExpressionBase } from "../expressions/base/expression-base";
import { ReferenceExpression } from "../expressions/reference-expression";

declare module '../expressions/base/entity-expression-base' {
    interface EntityExpressionBase<T> {
        Reference<TTo>(to: (from: T) => TTo | TTo[]): ExpressionBase<TTo>;
    }
}

EntityExpressionBase.prototype.Reference = function <T, TTo>(to: (from: T) => TTo | TTo[]) {
    let entityDiagram = Schema.Base.GetOrAddEntity(this.EntityConstructor);
    
    let toExpression = to.toString();
    let expressionTreeNode = LambdaLexers.SelectFieldLambda.Parse(toExpression);
    
    let toFieldName = GetFieldFromExpressionTreeNode(expressionTreeNode);

    let relationship = Schema.Base.Relationships[entityDiagram.Name][toFieldName];

    let toEntity = Schema.Base.GetOrAddEntity(relationship.GetToType());

    return new ReferenceExpression(toEntity.Constructor, this, relationship);
}

function GetFieldFromExpressionTreeNode(expressionTreeNode: ExpressionTreeNode) {
    let selectFieldWithBrackets = expressionTreeNode[3];

    while (!selectFieldWithBrackets[0].length) {
        selectFieldWithBrackets = selectFieldWithBrackets[1];
    }

    let selectField = selectFieldWithBrackets;
    let field = selectField[2];

    return field.Value;
}