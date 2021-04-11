import { SourceExpression } from "../../expression/expressions/source-expression";
import { DbContextBase } from "../db-context/db-context-base";
import { QueryingBase } from "./querying-base";

export class DataSetQuerying<T> extends QueryingBase<T> {
    constructor(
        dbContext: DbContextBase,
        public SourceExpression: SourceExpression<T>
    ) {
        super(dbContext, SourceExpression);
    }
}