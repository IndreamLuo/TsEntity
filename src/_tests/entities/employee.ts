import { column, entity, one } from "../../schema/decorators";
import { Company } from "./company";

@entity()
export class Employee {
    constructor() {}

    @one(() => Company)
    Company!: Company;

    @column()
    LastUpdated!: Date;
}