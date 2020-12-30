import { RelationshipDiagram } from "../../schema/relationship-diagram";
import { ConstructorType } from "../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";

export class ReferenceExpression<TFrom, TTo> extends EntityExpressionBase<TTo> {
    constructor (
        public From: EntityExpressionBase<TFrom>,
        public Relationship: RelationshipDiagram<TFrom, TTo>
    ) {
        super(Relationship.GetToType());
    }
}