import { EntityDiagram } from "./entity-diagram";

export class RelationshipDiagram<TFrom, TTo> {
    constructor (
        public IsMultiple: Boolean,
        public From: EntityDiagram<TFrom>,
        public GetToType: () => TTo,
        public Name: string,
        public ForeignKeys: string[]
    ) {}
}