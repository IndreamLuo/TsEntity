export class EntityColumnConfiguration {
    constructor (public Name: string) {

    }
}

export class EntityKeyConfiguration extends EntityColumnConfiguration {
    
}

export class EntityRelationshipConfiguration extends EntityColumnConfiguration {
    constructor (name: string, many: boolean = false) {
        super(name);
    }
}