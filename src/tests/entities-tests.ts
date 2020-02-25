import { Company } from "./entities/company";
import { Employee } from "./entities/employee";
import { EntityConfiguration } from "../entity/configuration/entity-configuration";
import { assert } from "./framework/tools";
import { tests, test } from "./framework/decorators";

@tests()
export class EntitiesTests {
    @test()
    CheckConfigurations() {
        assert(EntityConfiguration.Get(Company).Table == 'COMPANY');
        assert(EntityConfiguration.Get(Company).Id.Name == 'ID');
        assert(EntityConfiguration.Get(Company).Columns['ID'].Name == 'ID');
        assert(EntityConfiguration.Get(Company).Columns['NAME'].Name == 'NAME');
        assert(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Name == 'EMPLOYEES');
        assert(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Many == true);

        assert(EntityConfiguration.Get(Employee).Table == 'EMPLOYEE');
        assert(EntityConfiguration.Get(Employee).Id.Name == '_UNKNOWN');
        assert(EntityConfiguration.Get(Employee).Columns["COMPANYID"].Name == 'COMPANYID');
        assert(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Name == 'COMPANY');
        assert(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Many == false);
    }
}
