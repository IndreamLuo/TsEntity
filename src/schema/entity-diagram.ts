import { ColumnDiagram } from "./column-diagram";
import { ConstructorType } from "../utilities/types/constructor-type";
import { RelationshipDiagram } from "./relationship-diagram";
import { Schema } from "./schema";
import { Pairing } from "./pairing";

export class EntityDiagram<TEntity> {
    constructor (public Schema: Schema, public Constructor: ConstructorType<TEntity>, public Name: string) {}

    Ids: ColumnDiagram[] = [];
    Columns: { [name: string]: ColumnDiagram } = {};
    Relationships: RelationshipDiagram<TEntity, any>[] = [];

    AddColumnIfNotExist(name: string) {
        this.Columns[name] = this.Columns[name] || new ColumnDiagram(name);
    }

    AddId(name: string) {
        this.AddColumnIfNotExist(name);

        !this.Ids.some(id => id.Name === name)
            && this.Ids.push(this.Columns[name]);
    }

    AddRelationship<TTo>(isMultiple: Boolean,
        getToEntityType: () => ConstructorType<TTo>,
        toName: keyof TEntity | string,
        pairingPattern: Pairing[]
    ) {
        let relationship = new RelationshipDiagram(isMultiple, this, getToEntityType, toName as keyof TEntity, pairingPattern);
        this.Relationships.push(relationship);
    }

    GetRelationship<TTo>(fieldName: string): RelationshipDiagram<TEntity, TTo> | undefined;
    GetRelationship<TTo>(toEntity: EntityDiagram<TTo>): RelationshipDiagram<TEntity, TTo> | undefined;
    GetRelationship<TTo>(toEntity: EntityDiagram<TTo> | string) {
        let relationshipOrNull: RelationshipDiagram<TEntity, TTo> | undefined;
        if (toEntity instanceof EntityDiagram) {
            relationshipOrNull = this.Relationships.find(item => item.GetToType() === (toEntity as EntityDiagram<TTo>).Constructor);
        } else {
            let filedName = toEntity as string;
            relationshipOrNull = this.Relationships.find(item => item.Name === filedName);
        }

        if (relationshipOrNull === undefined) {
            return relationshipOrNull;
        }

        let relationship = relationshipOrNull!;

        if (!relationship.FromKeys.length || relationship.FromKeys.length !== relationship.ToKeys.length) {
            if (!(toEntity instanceof EntityDiagram)) {
                let toEntityType = relationship.GetToType();
                toEntity = this.Schema.GetOrAddEntity(toEntityType);
            }

            let pairingPattern = relationship.PairingPattern;

            if (!pairingPattern.length) {
                if (!relationship.IsMultiple) {
                    if (!toEntity.Ids.length) {
                        toEntity.AddId('Id');
                    }

                    pairingPattern = toEntity.Ids.map(id => ({
                        ToKey: id.Name
                    }));
                } else if (relationship.IsMultiple) {
                    if (!this.Ids.length) {
                        this.AddId('Id');
                    }
                    
                    pairingPattern = this.Ids.map((_, index) => {
                        let id = `${this.Name}Id${index ? index : ''}`;
                        (toEntity as EntityDiagram<TTo>).AddColumnIfNotExist(id);

                        return {
                            ToKey: id
                        }
                    });
                }
            }
        
            pairingPattern = pairingPattern.map((pairing, index) => {
                if (relationship.IsMultiple) {
                    if (!pairing.FromKey) {
                        pairing.FromKey = this.Ids.length > index
                            ? this.Ids[0].Name
                            : `Id${index}`;
                    }
                    if (!pairing.ToKey) {
                        let expectedColumnName = pairing.FromKey!.indexOf(this.Name) >= 0 ? pairing.FromKey : `${this.Name}${pairing.FromKey}`;
                        let foreignKeyColumn = (toEntity as EntityDiagram<TTo>).Columns[expectedColumnName];
                        if (!foreignKeyColumn) {
                            (toEntity as EntityDiagram<TTo>).AddColumnIfNotExist(expectedColumnName);
                            foreignKeyColumn = (toEntity as EntityDiagram<TTo>).Columns[expectedColumnName];
                        }
                        pairing.ToKey = foreignKeyColumn.Name;
                    }
                } else {
                    if (!pairing.ToKey) {
                        let existingColumn: ColumnDiagram;
                        if ((toEntity as EntityDiagram<TTo>).Ids.length > index) {
                            existingColumn = (toEntity as EntityDiagram<TTo>).Ids[index];
                        } else {
                            let entityIdIndex = `${(toEntity as EntityDiagram<TTo>).Name}Id${index > 0 ? index : ''}`;
                            existingColumn = this.Columns[entityIdIndex]
                                || this.Columns[`${(toEntity as EntityDiagram<TTo>).Name}Id${index > 0 ? index : ''}`];

                            if (!existingColumn) {
                                (toEntity as EntityDiagram<TTo>).AddColumnIfNotExist(entityIdIndex);
                                existingColumn = (toEntity as EntityDiagram<TTo>).Columns[entityIdIndex];
                            }
                        }

                        pairing.ToKey = existingColumn.Name;
                    }

                    if (!pairing.FromKey) {
                        let relationshipIdIndex = `${relationship.Name}Id${index > 0 ? index : ''}`;
                        let existingColumn = this.Columns[relationshipIdIndex]
                            || this.Columns[`${(toEntity as EntityDiagram<TTo>).Name}Id${index > 0 ? index : ''}`];

                        if (!existingColumn) {
                            this.AddColumnIfNotExist(relationshipIdIndex);
                            existingColumn = this.Columns[relationshipIdIndex];
                        }

                        pairing.FromKey = existingColumn.Name;
                    }
                }

                return {
                    FromKey: pairing.FromKey,
                    ToKey: pairing.ToKey
                };
            });

            relationship.ResetPairingPattern(pairingPattern);
        }
        
        return relationship;
    }

    GetReserveRelationship<TFrom, TTo>(relationship: RelationshipDiagram<TFrom, TTo>): RelationshipDiagram<TTo, TFrom> | undefined {
        let toType = relationship.GetToType();
        let toEntityDiagram = this.Schema.GetOrAddEntity(toType);
        let reverseRelationship = toEntityDiagram.GetRelationship(relationship.From);

        if (!reverseRelationship) {
            toEntityDiagram.AddRelationship(
                !relationship.IsMultiple,
                () => this.Constructor,
                this.Name,
                relationship.PairingPattern.map(pairing => ({
                    FromKey: pairing.ToKey,
                    ToKey: pairing.FromKey
                }))
            );

            reverseRelationship = toEntityDiagram.GetRelationship(relationship.From);
        }

        return reverseRelationship;
    }
}