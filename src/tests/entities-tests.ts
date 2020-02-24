import { Company } from "./entities/company";
import { Employee } from "./entities/employee";

export class EntitiesTests {
    static Build() {
        let company = new Company();
        let employee = new Employee();

        console.log((company as any)['_entity']['table']);
        console.log((employee as any)['_entity']['table']);
    }
}

EntitiesTests.Build();