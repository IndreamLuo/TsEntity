import { table, column, id, many } from "../../entity/decorators";
import { Employee } from "./employee";
import { EntitySet } from "../../entity/entity-set-domain";

@table('Company')
export class Company {
    @id()
    Id!: number;

    @column('Name')
    Name!: string;

    @many(Employee)
    Employees!: EntitySet<Employee>;
}