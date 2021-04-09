import { SourceExpressionBuilder } from "../../../../expression/builder/source-builder";
import { MsSqlQueryBuilder } from "../../../../query/builder/mssql/mssql-query-builder";
import { QueryPlanGenerator } from "../../../../query/plan/query-plan-generator";
import { Configuration } from "../../../../utilities/configuration";
import { Assignment } from "../../../entities/assignment";
import { Company } from "../../../entities/company";
import { Employee } from "../../../entities/employee";
import { Assert } from "../../../_framework/assert";
import { test, tests } from "../../../_framework/decorators";

@tests()
export class MsSqlQueryBuilderTests {
    async init() {
        let mssql = require('mssql/msnodesqlv8');
        let connectionString = Configuration.mssql;
        
        this.QueryPlanGenerator = new QueryPlanGenerator();
        this.MsSqlQueryBuilder = new MsSqlQueryBuilder();
        this.MsSqlClient = await (mssql.connect(connectionString) as Promise<any>);
    }

    async dispose() {
        this.MsSqlClient.close();
    }

    QueryPlanGenerator!: QueryPlanGenerator;
    MsSqlQueryBuilder!: MsSqlQueryBuilder;
    MsSqlClient!: any;

    @test()
    async BuildSourceExpressionQuery() {
        let sourceExpression = SourceExpressionBuilder.New(Company);

        let queryPlan = this.QueryPlanGenerator.BuildQueryPlan(sourceExpression);
        let query = this.MsSqlQueryBuilder.BuildQuery(queryPlan);
        let queryString = this.MsSqlQueryBuilder.BuildQueryString(query);

        Assert.IsTrue(queryString);
        Assert.IsTrue(queryString.indexOf('SELECT') >= 0);
        Assert.IsTrue(queryString.indexOf('FROM') >= 0);

        let companies: Company[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsNotEmpty(companies);
        companies.forEach(company => {
            Assert.IsTrue(company.Id);
            Assert.IsTrue(company.Name);
            Assert.IsTrue(company.LastUpdated);
        });
    }

    @test()
    async BuildReferenceExpressionQuery() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        let employeesExpression = companiesExpression.Reference(company => company.Employees);

        let queryPlan = this.QueryPlanGenerator.BuildQueryPlan(employeesExpression);
        let query = this.MsSqlQueryBuilder.BuildQuery(queryPlan);
        let queryString = this.MsSqlQueryBuilder.BuildQueryString(query);

        Assert.IsTrue(queryString);
        Assert.IsTrue(queryString.indexOf('SELECT') >= 0);
        Assert.IsTrue(queryString.indexOf('FROM') >= 0);
        Assert.IsTrue(queryString.indexOf('INNER JOIN') >= 0);

        let employees: Employee[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsNotEmpty(employees);
        employees.forEach(employee => {
            Assert.IsTrue(employee.LastUpdated);
            Assert.IsTrue((employee as any)['Company.Id']);
            Assert.IsTrue((employee as any)['Company.Name']);
            Assert.IsTrue((employee as any)['Company.LastUpdated']);
        });

        let assignmentsExpression = employeesExpression.Reference(employee => employee.Assignments);
        queryPlan = this.QueryPlanGenerator.BuildQueryPlan(assignmentsExpression);
        query = this.MsSqlQueryBuilder.BuildQuery(queryPlan);
        queryString = this.MsSqlQueryBuilder.BuildQueryString(query);

        let assignments: Assignment[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsNotEmpty(assignments);
        assignments.forEach(assignment => {
            Assert.IsTrue(assignment.Name);
            Assert.IsTrue(assignment.Created);
            Assert.IsTrue(assignment.LastUpdated);
            Assert.IsTrue((assignment as any)['Employee.Id']);
            Assert.IsTrue((assignment as any)['Employee.LastUpdated']);
            Assert.IsTrue((assignment as any)['Employee.Company.Id']);
            Assert.IsTrue((assignment as any)['Employee.Company.Name']);
            Assert.IsTrue((assignment as any)['Employee.Company.LastUpdated']);
        });
    }

    @test()
    async BuildFilterExpressionQuery() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        let filteredCompaniesExpression = companiesExpression.Filter(company => company.Id > 1);

        let queryPlan = this.QueryPlanGenerator.BuildQueryPlan(filteredCompaniesExpression);
        let query = this.MsSqlQueryBuilder.BuildQuery(queryPlan);
        let queryString = this.MsSqlQueryBuilder.BuildQueryString(query);
        
        Assert.IsTrue(queryString);
        Assert.IsTrue(queryString.indexOf('SELECT') >= 0);
        Assert.IsTrue(queryString.indexOf('FROM') >= 0);
        Assert.IsTrue(queryString.indexOf('WHERE') >= 0);

        let companies: Company[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsNotEmpty(companies);
        companies.forEach(company => {
            Assert.IsTrue(company.Name);
            Assert.IsTrue(company.LastUpdated);
            Assert.IsTrue(company.Id > 1);
        });

        let employeesExpression = filteredCompaniesExpression.Reference(company => company.Employees);
        let lastUpdated = companies[0].LastUpdated;
        let filteredEmployeesExpression = employeesExpression.Filter([lastUpdated], (employee, lastUpdated) => employee.LastUpdated >= lastUpdated);

        queryPlan = this.QueryPlanGenerator.BuildQueryPlan(filteredEmployeesExpression);
        query = this.MsSqlQueryBuilder.BuildQuery(queryPlan);
        queryString = this.MsSqlQueryBuilder.BuildQueryString(query);

        let employees: Employee[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsNotEmpty(employees);
        employees.forEach(employee => {
            Assert.IsTrue(employee.LastUpdated);
            Assert.IsTrue(employee.LastUpdated >= lastUpdated);
        });
    }
}