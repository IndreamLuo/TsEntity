import { column, entity, one } from "../../schema/decorators";
import { Employee } from "./employee";

@entity()
export class Assignment {
    @column()
    Name!: string;
    
    @column()
    Created!: Date;

    @column()
    LastUpdated!: Date;

    @one(() => Employee)
    Employee!: Employee;
}