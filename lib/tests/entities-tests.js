"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const company_1 = require("./entities/company");
const employee_1 = require("./entities/employee");
const entity_configuration_1 = require("../entity/configuration/entity-configuration");
class EntitiesTests {
    static CheckConfigurations() {
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Table);
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Id.Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Columns['ID'].Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Columns['NAME'].Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Relationships['EMPLOYEES'].Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Relationships['EMPLOYEES'].Many);
        console.info(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Table);
        console.info(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Id.Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Columns["COMPANYID"].Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Relationships["COMPANY"].Name);
        console.info(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Relationships["COMPANY"].Many);
    }
}
exports.EntitiesTests = EntitiesTests;
EntitiesTests.CheckConfigurations();
