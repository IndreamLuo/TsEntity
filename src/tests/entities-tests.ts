import { Company } from "./entities/company";
import { Employee } from "./entities/employee";
import { EntityConfiguration } from "../entity/configuration/entity-configuration";

export class EntitiesTests {
    static CheckConfigurations() {
        console.log(EntityConfiguration.Get(Company).Table);
        console.log(EntityConfiguration.Get(Company).Columns['name'].Name);

        console.log(EntityConfiguration.Get(Employee).Table);
    }
}

EntitiesTests.CheckConfigurations();