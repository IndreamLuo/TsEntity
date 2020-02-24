"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function table(tableName = null) {
    return (constructor) => {
        var newTarget = function (...args) {
            let result = new constructor(args);
            result['_entity'] = result['_entity'] || {};
            result['_entity'].table = tableName || constructor.name;
            return result;
        };
        newTarget.prototype = constructor.prototype;
        return newTarget;
    };
}
exports.table = table;
