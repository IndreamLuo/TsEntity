"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityColumnConfiguration {
    constructor(Name) {
        this.Name = Name;
    }
}
exports.EntityColumnConfiguration = EntityColumnConfiguration;
EntityColumnConfiguration.Unknown = new EntityColumnConfiguration('_UNKNOWN');
class EntityIdConfiguration extends EntityColumnConfiguration {
}
exports.EntityIdConfiguration = EntityIdConfiguration;
class EntityRelationshipConfiguration {
    constructor(EntityConfiguration, Name, Type, foreignKey = null, Many = false) {
        this.EntityConfiguration = EntityConfiguration;
        this.Name = Name;
        this.Type = Type;
        this.Many = Many;
        this.ForeignKey = null;
        if (foreignKey != null) {
            this.ForeignKey = this.EntityConfiguration.SetColumn(foreignKey);
        }
    }
}
exports.EntityRelationshipConfiguration = EntityRelationshipConfiguration;
