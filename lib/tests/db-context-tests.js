"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_context_1 = require("../db-context");
const company_1 = require("./entities/company");
class DbContextTests {
    constructor() {
        this.dbContext = new db_context_1.DbContext();
    }
    selectFromDb() {
        var companies = this.dbContext.Select(company_1.Company);
        console.log(companies.GetQueryString());
    }
    take() {
        var companies = this.dbContext.Select(company_1.Company);
        var company = companies.Take(5);
        console.log(company.GetQueryString());
    }
    one() {
        var companies = this.dbContext.Select(company_1.Company);
        var company = companies.One();
        console.log(company.GetQueryString());
    }
    select() {
        var companiesEntity = this.dbContext.Select(company_1.Company);
        var companyEntity = companiesEntity.One();
        // var employeesEntity = companyEntity.Select(company => company.employees);
        // console.log(employeesEntity.GetQueryString());
    }
}
let tests = new DbContextTests();
tests.selectFromDb();
tests.take();
tests.one();
tests.select();
