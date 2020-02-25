"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_set_1 = require("./entity-set");
class DbContext {
    Select(entityType) {
        return new entity_set_1.TableEntitySet(entityType);
    }
}
exports.DbContext = DbContext;
