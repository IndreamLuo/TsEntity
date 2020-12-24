import { SourceExpressionBuilder } from "../../expression/builder/source-builder";
import { Company } from "../entities/company";
import { Employee } from "../entities/employee";
import { Assert } from "../_framework/assert";
import { test, tests } from "../_framework/decorators";

@tests()
export class BuilderTests {
    @test()
    BuildExpressionTest() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        Assert.AreEqual(companiesExpression.EntityConstructor, Company);
        
        let employeesExpression = companiesExpression.Reference(company => company.Employees);
        Assert.AreEqual(employeesExpression.EntityConstructor, Employee);
        Assert.AreEqual(employeesExpression.From, companiesExpression);
    }
}