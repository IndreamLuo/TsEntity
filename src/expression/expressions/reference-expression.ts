import { RelationshipDiagram } from "../../schema/relationship-diagram";
import { Schema } from "../../schema/schema";
import { EntityExpressionBase } from "./base/entity-expression-base";

export class ReferenceExpression<TFrom, TTo> extends EntityExpressionBase<TTo> {
    constructor (
        public From: EntityExpressionBase<TFrom>,
        public Relationship: RelationshipDiagram<TFrom, TTo>
    ) {
        super(From.Schema, Relationship.GetToType());
    }
}