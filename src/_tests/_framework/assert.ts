export class Assert {
    static IsTrue(assertion: any, errorMessage: () => string = () => `[${assertion}] is not TRUE.`) {
        if (assertion instanceof Function) {
            assertion = assertion();
        }
    
        if (!assertion) {
            throw new Error(errorMessage());
        }
    }

    static IsFalse(assertion: any, errorMessage: () => string = () => `[${assertion}] is not FALSE.`) {
        this.IsTrue(!assertion, errorMessage);
    }

    static AreEqual(left: any, right: any, errorMessage: () => string = () => `[${left}] is not equal to [${right}].`) {
        return this.IsTrue(left == right, errorMessage);
    }

    static AreNotEqual(left: any, right: any, errorMessage: () => string = () => `[${left}] is equal to [${right}].`) {
        return this.IsFalse(left == right, errorMessage);
    }

    static IsEmpty<T>(array: T[], errorMessage: () => string = () => `[${array.join(', ')}] is not empty.`) {
        return this.IsTrue(array.length === 0, errorMessage);
    }

    static IsNotEmpty<T>(array: T[], errorMessage: () => string = () => `Array is empty.`) {
        return this.IsTrue(array.length > 0, errorMessage);
    }

    static WillThrowError(call: Function, errorMessage: string) {
        try {
            let invoke = call();
            if (invoke && invoke.constructor === Promise) {
                (async () => await invoke)();
            }
            throw Error('No error thrown.');
        } catch (error) {
            Assert.AreEqual(error.message, errorMessage);
        }
    }

    static HasSameStructure(object: any, structure: any, skipItems: any[] = [], stack: string[] = []) {
        if (skipItems.some(item => item === structure)) {
            return;
        }

        if (Array.isArray(object)) {
            Assert.IsTrue(Array.isArray(structure), () => `Subject is not an array while object is an array[${object.length}].`);
            Assert.AreEqual(object.length, structure.length, () => `Subject array length(${object.length}) is not same as object array length(${structure.length}).`);
            for (let index = 0; index < object.length; index++) {
                Assert.HasSameStructure(object[index], structure[index], skipItems, stack);
            }
            return;
        }

        if (typeof(structure) !== 'object' || object === null || object === undefined) {
            Assert.AreEqual(object, structure, () => {
                let stacks = stack.join('.');
                return `object.${stacks}:${object} doesn't equal to structure.${stacks}:${structure}.`;
            });
            return;
        }

        Object.keys(structure).forEach(key => {
            if (typeof(structure[key]) === 'object') {
                skipItems.push(structure[key]);
            }

            stack.push(key);
            Assert.HasSameStructure(object[key], structure[key], skipItems, stack);
            stack.pop();

            
            if (typeof(structure[key]) === 'object') {
                skipItems.pop();
            }
        });
    }
}