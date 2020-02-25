import { Company } from "./entities/company";
import { Employee } from "./entities/employee";
import { EntityConfiguration } from "../entity/configuration/entity-configuration";

export class EntitiesTests {
    static CheckConfigurations() {
        console.info(EntityConfiguration.Get(Company).Table);
        console.info(EntityConfiguration.Get(Company).Id.Name);
        console.info(EntityConfiguration.Get(Company).Columns['ID'].Name);
        console.info(EntityConfiguration.Get(Company).Columns['NAME'].Name);
        console.info(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Name);
        console.info(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Many);

        console.info(EntityConfiguration.Get(Employee).Table);
        console.info(EntityConfiguration.Get(Employee).Id.Name);
        console.info(EntityConfiguration.Get(Employee).Columns["COMPANYID"].Name);
        console.info(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Name);
        console.info(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Many);
    }
}

EntitiesTests.CheckConfigurations();