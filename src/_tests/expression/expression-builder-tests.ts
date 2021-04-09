import { SourceExpressionBuilder } from "../../expression/builder/source-builder";
import { EntityExpressionBase } from "../../expression/expressions/base/entity-expression-base";
import { ReferenceExpression } from "../../expression/expressions/reference-expression";
import { Operator } from "../../utilities/types/operators";
import { Company } from "../entities/company";
import { Employee } from "../entities/employee";
import { Assert } from "../_framework/assert";
import { test, tests } from "../_framework/decorators";

@tests()
export class ExpressionBuilderTests {
    @test()
    BuildSourceExpression() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        Assert.AreEqual(companiesExpression.EntityConstructor, Company);
    }

    @test()
    BuildReferenceExpression() {
        let companiesExpression: EntityExpressionBase<Company> = SourceExpressionBuilder.New(Company);
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
        let filteredCompaniesExpression = companiesExpression.Filter(company => company.Id == 7);
        Assert.HasSameStructure(filteredCompaniesExpression, {
            EntityConstructor: companiesExpression.EntityConstructor,
            From: companiesExpression,
            Condition: {
                Operator: Operator.EqualTo,
                LeftValue: {
                    Of: {
                        EntityConstructor: companiesExpression.EntityConstructor,
                        Of: {
                            EntityConstructor: companiesExpression.EntityConstructor
                        }
                    },
                    Diagram: {
                        Name: 'Id'
                    }
                },
                RightValue: { Value: 7 }
            }
        });

        let employeesExpression = companiesExpression.Reference(company => company.Employees);
        let filteredEmployeesExpression = employeesExpression.Filter([companiesExpression.Token()], (employee, company) => employee.LastUpdated == company.LastUpdated);
        Assert.HasSameStructure(filteredEmployeesExpression, {
            EntityConstructor: employeesExpression.EntityConstructor,
            From: employeesExpression,
            Condition: {
                Operator: Operator.EqualTo,
                LeftValue: {
                    Of: {
                        EntityConstructor: employeesExpression.EntityConstructor,
                        Of: {
                            EntityConstructor: employeesExpression.EntityConstructor
                        }
                    },
                    Diagram: {
                        Name: 'LastUpdated'
                    }
                },
                RightValue: {
                    Of: {
                        EntityConstructor: companiesExpression.EntityConstructor,
                        Of: {
                            EntityConstructor: companiesExpression.EntityConstructor
                        }
                    },
                    Diagram: {
                        Name: 'LastUpdated'
                    }
                }
            }
        });
    }
}