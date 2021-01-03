import { ConstructorType } from "../utilities/types/constructor-type";
import { EntityDiagram } from "./entity-diagram";

export class Schema {
    constructor () {}

    static Base: Schema = new Schema();

    Entities: { [name: string]: EntityDiagram<any>; } = {};

    private EntityNameRecords: {
        [constructorName: string]: { Constructor: ConstructorType<any>, EntityName: string }[]
    } = {};

    GetOrAddEntity<T>(constructor: ConstructorType<T>, entityName: string = constructor.name): EntityDiagram<T> {
        let entityNameRecords = this.EntityNameRecords[constructor.name];

        if (!entityNameRecords) {
            entityNameRecords = this.EntityNameRecords[constructor.name] = [];
        }

        let entityRecord = entityNameRecords.find(entityNameRecord => entityNameRecord.Constructor == constructor);

        if (!entityRecord) {
            entityRecord = { Constructor: constructor, EntityName: entityName };
            entityNameRecords.push(entityRecord);
        }

        this.Entities[entityRecord.EntityName] = this.Entities[entityRecord.EntityName]
            || new EntityDiagram<T>(this, constructor, entityRecord.EntityName);

        return this.Entities[entityRecord.EntityName];
    }
}