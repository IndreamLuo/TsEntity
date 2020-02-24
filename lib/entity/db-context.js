"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_set_domain_1 = require("./entity-set-domain");
class DBContext {
    Repository(entityType) {
        return new entity_set_domain_1.TableEntitySet(entityType);
    }
}
exports.DBContext = DBContext;
