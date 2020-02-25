import { DbContext } from "../db-context";
import { Company } from "./entities/company";

class DbContextTests {
    dbContext = new DbContext();

    selectFromDb() {
        var companies = this.dbContext.Select(Company);

        console.log(companies.GetQueryString());
    }

    take() {
        var companies = this.dbContext.Select(Company);
        var company = companies.Take(5);

        console.log(company.GetQueryString());
    }

    one() {
        var companies = this.dbContext.Select(Company);
        var company = companies.One();

        console.log(company.GetQueryString());
    }

    select() {
        var companiesEntity = this.dbContext.Select(Company);
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