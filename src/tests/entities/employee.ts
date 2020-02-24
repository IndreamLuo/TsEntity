import { table } from "../../entity/decorators";
import { Company } from "./company";

@table()
export class Employee {
    Company!: Company
}