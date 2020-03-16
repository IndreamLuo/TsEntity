import { table, column, id, many } from "../../entity/decorators";
import { Employee } from "./employee";

@table('Company')
export class Company {
    @id()
    Id!: number;

    @column('Name')
    Name!: string;

    @many(Employee)
    Employees!: Employee[];
}