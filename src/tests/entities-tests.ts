import { tests, test } from "./framework/decorators";
import { Assert } from "./framework/tools";
import { Schema } from "../schema/schema";
import { Company } from "./entities/company";
import { Employee } from "./entities/employee";

@tests()
export class EntitiesTests {
    @test()
    CheckConfigurations() {
        Assert.AreEqual(Schema.Base.Entities[Company.name].Constructor, Company);
        Assert.AreEqual(Schema.Base.Entities[Company.name].Name, "Company");
        Assert.AreEqual(Schema.Base.Entities[Employee.name].Constructor, Employee);
        Assert.AreEqual(Schema.Base.Entities[Employee.name].Name, "Employee");
        
        let companyDiagram = Schema.Base.GetOrAddEntity(Company);
        let employeeDiagram = Schema.Base.GetOrAddEntity(Employee);

        Assert.AreEqual(companyDiagram.Ids.length, 1);
        Assert.AreEqual(companyDiagram.Ids[0].Name, 'Id');
        Assert.AreEqual(Object.keys(companyDiagram.Columns).length, 2);
        Assert.AreEqual(companyDiagram.Columns['Id'].Name, 'Id');
        Assert.AreEqual(companyDiagram.Columns['Name'].Name, 'Name');

        Assert.AreEqual(employeeDiagram.Ids.length, 0);
    }

    @test()
    GetEmployeeCompany() {
        //To be finished
    }
}
