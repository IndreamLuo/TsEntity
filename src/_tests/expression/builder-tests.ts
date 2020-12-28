import { SourceExpressionBuilder } from "../../expression/builder/source-builder";
import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { Company } from "../entities/company";
import { Employee } from "../entities/employee";
import { Assert } from "../_framework/assert";
import { test, tests } from "../_framework/decorators";

@tests()
export class BuilderTests {
    @test()
    BuildSourceExpression() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        Assert.AreEqual(companiesExpression.EntityConstructor, Company);
    }

    @test()
    BuildReferenceExpression() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        let employeesExpression = companiesExpression.Reference(company => company.Employees);
        Assert.AreEqual(employeesExpression.EntityConstructor, Employee);
        Assert.AreEqual(employeesExpression.From, companiesExpression);

        companiesExpression = employeesExpression.Reference(employee => employee.Company);
        Assert.AreEqual(companiesExpression.EntityConstructor, Company);
        Assert.AreEqual((companiesExpression as ReferenceExpression<Employee, Company>).From, employeesExpression);

        let employeeExpression = SourceExpressionBuilder.New(Employee);
        employeesExpression = employeeExpression
            .Reference(employee => employee.Company)
            .Reference(company => company.Employees);
        Assert.AreEqual(employeesExpression.EntityConstructor, Employee);
        Assert.AreEqual(employeesExpression.From.EntityConstructor, Company);
        Assert.AreEqual((employeesExpression.From as ReferenceExpression<Employee, Company>).From.EntityConstructor, Employee);

        employeesExpression = employeeExpression.Reference(employee => employee.Company.Employees);
        Assert.AreEqual(employeesExpression.EntityConstructor, Employee);
        Assert.AreEqual(employeesExpression.From.EntityConstructor, Company);
        Assert.AreEqual((employeesExpression.From as ReferenceExpression<Employee, Company>).From.EntityConstructor, Employee);

        Assert.WillThrowError(() => companiesExpression.Reference(company => company), 'Cannot self-reference.');
    }

    @test()
    BuildFilterExpression() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        let employeesExpression = companiesExpression.Reference(company => company.Employees);

        // let filteredCompaniesExpression = companiesExpression.Filter(company => company.Id == 7);
    }
}