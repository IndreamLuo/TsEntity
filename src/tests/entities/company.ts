import { table, column } from "../../entity/decorators";
import { Employee } from "./employee";

@table('Company')
export class Company {
    id!: number;

    @column('name')
    name!: string;

    employees!: Employee[];
}