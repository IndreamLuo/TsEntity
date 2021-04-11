import { StringDictionary } from "../types/dictionaries";

export function cache(hash: (...args: any[]) => string) {
    return function (object: Object, propertyName: string, descriptor: PropertyDescriptor) {
        let origin = descriptor.value;
        descriptor.value = function (...args: any[]) {
            (this as any)._cache = (this as any)._cache || {};
            let cache = (this as any)._cache as StringDictionary<StringDictionary<any>>;
            
            let cacheSet = cache._cache[propertyName];
            let hashKey = hash(args);
            cacheSet[hashKey] = cacheSet[hashKey] || origin.apply(this, args);

            return cacheSet[hashKey];
        }
    }
}