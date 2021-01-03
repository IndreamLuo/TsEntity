import { ConstructorType } from "../utilities/types/constructor-type";
import { EntityDiagram } from "./entity-diagram";
import { Pairing } from "./pairing";

export class RelationshipDiagram<TFrom, TTo> {
    constructor (
        public IsMultiple: Boolean,
        public From: EntityDiagram<TFrom>,
        public GetToType: () => ConstructorType<TTo>,
        public Name: keyof TFrom,
        public PairingPattern: Pairing[]
    ) {
        this.ResetPairingPattern(PairingPattern);
    }

    ResetPairingPattern(pairingPattern: Pairing[]) {
        this.PairingPattern = pairingPattern;
        this.FromKeys = this.PairingPattern.map(match => match.FromKey).filter(key => key) as string[];
        this.ToKeys = this.PairingPattern.map(match => match.ToKey).filter(key => key) as string[];
    }

    FromKeys!: string[];
    ToKeys!: string[];
}