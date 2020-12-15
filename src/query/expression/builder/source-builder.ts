import { ConstructorType } from "../../../utilities/types/constructor-type";
import { SourceExpression } from "../expressions/source-expression";

export class SourceExpressionBuilder {
    New<T>(entityConstructor: ConstructorType<T>) {
        return new SourceExpression(entityConstructor);
    }
}