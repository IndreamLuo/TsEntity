export class Assert {
    static IsTrue(assertion: any, errorMessage: string = `[${assertion}] is not TRUE.`) {
        if (assertion instanceof Function) {
            assertion = assertion();
        }
    
        if (!assertion) {
            throw new Error(errorMessage);
        }
    }

    static IsFalse(assertion: any, errorMessage: string = `[${assertion}] is not FALSE.`) {
        this.IsTrue(!assertion, errorMessage);
    }

    static AreEqual(left: any, right: any, errorMessage: string = `[${left}] is not equal to [${right}].`) {
        return this.IsTrue(left == right, errorMessage);
    }

    static AreNotEqual(left: any, right: any, errorMessage: string = `[${left}] is equal to [${right}].`) {
        return this.IsFalse(left == right, errorMessage);
    }

    static WillThrowError(call: Function, errorMessage: string) {
        try {
            call();
        } catch (error) {
            Assert.AreEqual(error.message, errorMessage);
        }
    }

    static HasSameStructure(object: any, structure: any, errorMessage: string | null = null) {
        if (typeof(structure) !== 'object' || object === null || object === undefined) {
            Assert.AreEqual(object, structure);
            return;
        }

        Object.keys(structure).forEach(key => {
            return Assert.HasSameStructure(object[key], structure[key]);
        });
    }
}