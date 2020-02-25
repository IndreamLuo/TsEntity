import { table, one } from "../../entity/decorators";
import { Company } from "./company";

@table()
export class Employee {
    constructor(company: Company) {
        this.Company = company;
    }

    @one(Company)
    Company: Company;
}