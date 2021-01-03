import { Source } from "./source";
import { SqlStatementBase } from "./sql-statement-base";

export class Column extends SqlStatementBase {
    constructor(public Name: string) {
        super();
    }
    
    Source?: Source;
    Alias?: string;
}