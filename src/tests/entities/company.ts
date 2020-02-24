import { table, column, key, many } from "../../entity/decorators";
import { Employee } from "./employee";

@table('Company')
export class Company {
    @key()
    Id!: number;

    @column('Name')
    Name!: string;

    @many(Employee)
    Employees!: Employee[];
}