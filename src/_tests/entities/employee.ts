import { column, entity, many, one } from "../../schema/decorators";
import { Assignment } from "./assignment";
import { Company } from "./company";

@entity()
export class Employee {
    constructor() {}

    @column()
    LastUpdated!: Date;

    @one(() => Company)
    Company!: Company;

    @many(() => Assignment)
    Assignments!: Assignment[];
}