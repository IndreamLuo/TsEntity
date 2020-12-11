import { column, entity, id, many } from "../../schema/decorators";
import { Employee } from "./employee";

@entity()
export class Company {
    @id()
    Id!: number;

    @column()
    Name!: string;

    @many(() => Employee)
    Employees!: Employee[];
}