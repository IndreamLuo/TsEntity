"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityConfiguration {
    constructor(Constructor) {
        this.Constructor = Constructor;
        this.Columns = {};
        this.Table = this.Constructor.name;
    }
    static Get(constructor) {
        let configurations = (EntityConfiguration.All[constructor.name] = EntityConfiguration.All[constructor.name] || []);
        for (var index in configurations) {
            if (configurations[index].Constructor == constructor) {
                return configurations[index];
            }
        }
        let newConfiguration = new EntityConfiguration(constructor);
        configurations.push(newConfiguration);
        return newConfiguration;
    }
}
exports.EntityConfiguration = EntityConfiguration;
EntityConfiguration.All = {};
