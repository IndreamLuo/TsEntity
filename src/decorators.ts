export function table(tableName: string | null = null) {
    return (constructor: any) => {
        var newTarget : any = function (...args: []) {
          let result = new constructor(args);

          result['_entity'] = result['_entity'] || {};
          result['_entity'].table = tableName || constructor.name;

          return result;
        }
       
        newTarget.prototype = constructor.prototype;
       
        return newTarget;
      }
}