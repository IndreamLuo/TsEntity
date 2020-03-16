import { Company } from "./entities/company";
import { Employee } from "./entities/employee";
import { EntityConfiguration } from "../entity/configuration/entity-configuration";
import { Assert } from "./framework/tools";
import { tests, test } from "./framework/decorators";

@tests()
export class EntitiesTests {
    @test()
    CheckConfigurations() {
        Assert.AreEqual(EntityConfiguration.Get(Company).Table, 'COMPANY');
        Assert.AreEqual(EntityConfiguration.Get(Company).Id.Name, 'ID');
        Assert.AreEqual(EntityConfiguration.Get(Company).Columns['ID'].Name, 'ID');
        Assert.AreEqual(EntityConfiguration.Get(Company).Columns['NAME'].Name, 'NAME');
        Assert.AreEqual(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Name, 'EMPLOYEES');
        Assert.AreEqual(EntityConfiguration.Get(Company).Relationships['EMPLOYEES'].Many, true);

        Assert.AreEqual(EntityConfiguration.Get(Employee).Table, 'EMPLOYEE');
        Assert.AreEqual(EntityConfiguration.Get(Employee).Id.Name, '_UNKNOWN');
        Assert.AreEqual(EntityConfiguration.Get(Employee).Columns["COMPANYID"].Name, 'COMPANYID');
        Assert.AreEqual(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Name, 'COMPANY');
        Assert.AreEqual(EntityConfiguration.Get(Employee).Relationships["COMPANY"].Many, false);
    }
}
