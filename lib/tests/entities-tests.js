"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const company_1 = require("./entities/company");
const employee_1 = require("./entities/employee");
const entity_configuration_1 = require("../entity/configuration/entity-configuration");
class EntitiesTests {
    static CheckConfigurations() {
        console.log(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Table);
        console.log(entity_configuration_1.EntityConfiguration.Get(company_1.Company).Columns['name'].Name);
        console.log(entity_configuration_1.EntityConfiguration.Get(employee_1.Employee).Table);
    }
}
exports.EntitiesTests = EntitiesTests;
EntitiesTests.CheckConfigurations();
