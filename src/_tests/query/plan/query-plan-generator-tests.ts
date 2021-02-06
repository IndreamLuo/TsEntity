import { SourceExpressionBuilder } from "../../../expression/builder/source-builder";
import { QueryPlanGenerator } from "../../../query/plan/query-plan-generator";
import { Company } from "../../entities/company";
import { Assert } from "../../_framework/assert";
import { test, tests } from "../../_framework/decorators";

@tests()
export class QueryPlanGeneratorTests {
    async init() {
        this.QueryPlanGenerator = new QueryPlanGenerator();
    }

    async dispose() {
        
    }

    QueryPlanGenerator!: QueryPlanGenerator;

    @test()
    SingleExpression() {
        let sourceExpression = SourceExpressionBuilder.New(Company);
        let queryPlan = this.QueryPlanGenerator.BuildQueryPlan(sourceExpression);

        Assert.AreEqual(queryPlan.Expression, sourceExpression);
        Assert.HasSameStructure(queryPlan.AllExpressions, [sourceExpression]);
        Assert.HasSameStructure(queryPlan.IndexedAllExpressions, {
            [sourceExpression.Id]: {
                Index: 0,
                Expression: sourceExpression
            }
        });
        Assert.HasSameStructure(queryPlan.StagingExpressions, [sourceExpression]);
        Assert.HasSameStructure(queryPlan.IndexedStagingExpressions, {
            [sourceExpression.Id]: {
                Index: 0,
                Expression: sourceExpression
            }
        });
    }

    @test()
    SingleChainExpression() {
        let companiesExpression = SourceExpressionBuilder.New(Company);
        let employeesExpression = companiesExpression.Reference(company => company.Employees);
        let queryPlan = this.QueryPlanGenerator.BuildQueryPlan(employeesExpression);

        Assert.AreEqual(queryPlan.Expression, employeesExpression);
        Assert.HasSameStructure(queryPlan.AllExpressions, [companiesExpression, employeesExpression]);
        Assert.HasSameStructure(queryPlan.IndexedAllExpressions, {
            [companiesExpression.Id]: {
                Index: 0,
                Expression: companiesExpression
            },
            [employeesExpression.Id]: {
                Index: 1,
                Expression: employeesExpression
            }
        });
        Assert.HasSameStructure(queryPlan.StagingExpressions, [employeesExpression]);
        Assert.HasSameStructure(queryPlan.IndexedStagingExpressions, {
            [employeesExpression.Id]: {
                Index: 0,
                Expression: employeesExpression
            }
        });
    }
}