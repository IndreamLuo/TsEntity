import { Schema } from "../../schema/schema";
import { ConstructorType } from "../../utilities/types/constructor-type";
import { SourceExpression } from "../expressions/source-expression";

export class SourceExpressionBuilder {
    static New<T>(entityConstructor: ConstructorType<T>) {
        let schema = Schema.Base;
        let entityDiagram = schema.GetOrAddEntity<T>(entityConstructor);
        
        return new SourceExpression(schema, entityConstructor, entityDiagram);
    }
}