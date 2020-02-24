"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const company_1 = require("./entities/company");
const employee_1 = require("./entities/employee");
class EntitiesTests {
    static Build() {
        let company = new company_1.Company();
        let employee = new employee_1.Employee();
        console.log(company['_entity']['table']);
        console.log(employee['_entity']['table']);
    }
}
exports.EntitiesTests = EntitiesTests;
EntitiesTests.Build();
