import { EntityDiagram } from "../../schema/entity-diagram";
import { Schema } from "../../schema/schema";
import { ConstructorType } from "../../utilities/types/constructor-type";
import { EntityExpressionBase } from "./base/entity-expression-base";

export class SourceExpression<T> extends EntityExpressionBase<T> {
    constructor (schema: Schema, entityConstructor: ConstructorType<T>, public EntityDiagram: EntityDiagram<T>) {
        super(schema, entityConstructor);
    }
}