import { Schema } from "../../schema/schema";
import { Company } from "../entities/company";
import { Employee } from "../entities/employee";
import { Assert } from "../_framework/assert";
import { test, tests } from "../_framework/decorators";

@tests()
export class SchemaTests {
    @test()
    SchemaBuiltCorrectly() {
        Assert.AreEqual(Object.keys(Schema.Base.Entities).length, 2);

        Assert.AreEqual(Schema.Base.Entities[Company.name].Constructor, Company);
        Assert.AreEqual(Schema.Base.Entities[Company.name].Name, "Company");
        Assert.AreEqual(Schema.Base.Entities[Employee.name].Constructor, Employee);
        Assert.AreEqual(Schema.Base.Entities[Employee.name].Name, "Employee");
        
        let companyDiagram = Schema.Base.GetOrAddEntity(Company);
        let employeeDiagram = Schema.Base.GetOrAddEntity(Employee);

        Assert.AreEqual(companyDiagram.Ids.length, 1);
        Assert.AreEqual(companyDiagram.Ids[0].Name, 'Id');
        Assert.AreEqual(Object.keys(companyDiagram.Columns).length, 3);
        Assert.AreEqual(companyDiagram.Columns['Id'].Name, 'Id');
        Assert.AreEqual(companyDiagram.Columns['Name'].Name, 'Name');

        Assert.AreEqual(employeeDiagram.Ids.length, 0);
    }
}