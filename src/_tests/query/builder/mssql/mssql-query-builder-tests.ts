import { SourceExpressionBuilder } from "../../../../expression/builder/source-builder";
import { MsSqlQueryBuilder } from "../../../../query/builder/mssql/mssql-query-builder";
import { Schema } from "../../../../schema/schema";
import { Configuration } from "../../../../utilities/configuration";
import { Company } from "../../../entities/company";
import { Assert } from "../../../_framework/assert";
import { test, tests } from "../../../_framework/decorators";

@tests()
export class MsSqlQueryBuilderTests {
    constructor () {
    }

    async init() {
        let mssql = require('mssql/msnodesqlv8');
        let connectionString = Configuration.mssql;
        
        this.MsSqlClient = await (mssql.connect(connectionString) as Promise<any>);
    }

    async dispose() {
        this.MsSqlClient.close();
    }

    MsSqlClient!: any;

    @test()
    async GetSourceExpressionQuery() {
        let sourceExpression = SourceExpressionBuilder.New(Company);

        let msSqlQueryBuilder = new MsSqlQueryBuilder(Schema.Base);
        let query = msSqlQueryBuilder.BuildQuery(sourceExpression);
        let queryString = msSqlQueryBuilder.BuildQueryString(query);

        Assert.IsTrue(queryString);
        Assert.IsTrue(queryString.indexOf('SELECT') >= 0);
        Assert.IsTrue(queryString.indexOf('FROM') >= 0);

        let companies: Company[] = (await this.MsSqlClient.request().query(queryString)).recordset;
        Assert.IsTrue(companies);
        companies.forEach(company => {
            Assert.IsTrue(company.Id);
            Assert.IsTrue(company.Name);
            Assert.IsTrue(company.LastUpdated);
        });
    }
}