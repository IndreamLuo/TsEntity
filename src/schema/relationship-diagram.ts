import { ConstructorType } from "../utilities/types/constructor-type";
import { EntityDiagram } from "./entity-diagram";

export class RelationshipDiagram<TFrom, TTo> {
    constructor (
        public IsMultiple: Boolean,
        public From: EntityDiagram<TFrom>,
        public GetToType: () => ConstructorType<TTo>,
        public Name: keyof TFrom,
        public ForeignKeys: string[]
    ) {}
}