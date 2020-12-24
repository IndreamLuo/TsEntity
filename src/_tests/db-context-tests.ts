import { Company } from "./entities/company";
import { DbContext, Sqlite3DbContext } from "../entity/db-context";
import { tests, test } from "./_framework/decorators";

@tests()
export class DbContextTests {
    constructor () {
        this.dbContext = new Sqlite3DbContext('./test.db');
    }

    dbContext: DbContext;

    @test()
    selectFromDb() {
        var companies = this.dbContext.All(Company);
    }

    @test()
    take() {
        var companies = this.dbContext.All(Company);
        var company = companies.Take(5);
    }

    @test()
    one() {
        var companies = this.dbContext.All(Company);
        var company = companies.One();
    }
}