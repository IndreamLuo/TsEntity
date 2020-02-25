import { EntityConfiguration } from "./entity-configuration";

export class EntityColumnConfiguration {
    constructor (public Name: string) {

    }

    static Unknown = new EntityColumnConfiguration('_UNKNOWN')
}

export class EntityIdConfiguration extends EntityColumnConfiguration {
    
}

export class EntityRelationshipConfiguration {
    constructor (public EntityConfiguration: EntityConfiguration, public Name: string, public Type: { new(): any }, foreignKey: string | null = null, public Many: boolean = false) {
        this.Name = this.Name.toUpperCase();

        if (foreignKey != null) {
            this.ForeignKey = this.EntityConfiguration.SetColumn(foreignKey);
        }
    }

    ForeignKey: EntityColumnConfiguration | null = null;
}