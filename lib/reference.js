"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const entity_set_1 = require("./entity-set");
function One(toEntity, fromColumn = undefined, toColumn = undefined) {
    return function (target, property) {
        let val = new entity_set_1.ReferenceEntitySet(target, fromColumn || `${property}Id`, toEntity(), `${target.constructor.name}Id`);
        Object.defineProperty(target, property, {
            get: () => val,
            set: (value) => val = value,
            configurable: true
        });
    };
}
exports.One = One;
function Many(toEntity, fromColumn = undefined, toColumn = undefined) {
    return function (target, property) {
        let val = new entity_set_1.ReferenceEntitySet(target, fromColumn || `${property}Id`, toEntity(), `${target.constructor.name}Id`);
        Object.defineProperty(target, property, {
            get: () => val,
            set: (value) => val = value,
            configurable: true,
            enumerable: true,
        });
    };
}
exports.Many = Many;
