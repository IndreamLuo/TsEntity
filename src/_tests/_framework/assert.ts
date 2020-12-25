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

    static ThrowError(call: Function, errorMessage: string) {
        try {
            call();
        } catch (error) {
            Assert.AreEqual(error.message, errorMessage);
        }
    }
}