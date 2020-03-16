import { Company } from "./entities/company";
import { DbContext } from "../entity/db-context";
import { tests, test } from "./framework/decorators";

@tests()
export class DbContextTests {
    dbContext = new DbContext();

    @test()
    selectFromDb() {
        var companies = this.dbContext.Select(Company);
    }

    @test()
    take() {
        var companies = this.dbContext.Select(Company);
        var company = companies.Take(5);
    }

    @test()
    one() {
        var companies = this.dbContext.Select(Company);
        var company = companies.One();
    }
}