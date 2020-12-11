import { ConstructorType } from "./constructor-type";
import { EntityDiagram } from "./entity-diagram";
import { RelationshipDiagram } from "./relationship-diagram";

export class Schema {
    constructor () {}

    static Base: Schema = new Schema();

    Entities: { [name: string]: EntityDiagram<any>; } = {};
    Relationships: { [from: string]: RelationshipDiagram<any, any>[] } = {}

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
            || new EntityDiagram<T>(constructor, entityRecord.EntityName);

        return this.Entities[entityRecord.EntityName];
    }

    AddRelationship<TFrom, TTo>(isMultiple: Boolean,
        from: EntityDiagram<TFrom>,
        getToEntityType: () => TTo,
        toName: string,
        ...foreignKeys: string[]
    ) {
        var relationship = new RelationshipDiagram(isMultiple, from, getToEntityType, toName, foreignKeys);
        (this.Relationships[from.Name] = this.Relationships[from.Name] || []).push(relationship);
    }
}