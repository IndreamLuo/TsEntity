export class Assure {
    static IsTrue(value: Boolean, buildErrorMessage: () => string) {
        if (!value) {
            throw Error(buildErrorMessage());
        }
    }
    
    static IsFalse(value: Boolean, buildErrorMessage: () => string) {
        Assure.IsTrue(!value, buildErrorMessage);
    }

    static IsNullOrUndefined(value: any, buildErrorMessage: () => string) {
        Assure.IsTrue(value === null || value === undefined, buildErrorMessage);
    }

    static IsNotNullOrUndefined(value: any, buildErrorMessage: () => string) {
        Assure.IsTrue(value !== null && value !== undefined, buildErrorMessage);
    }

    static AreEqual<T>(value1: T, value2: T, buildErrorMessage: () => string) {
        Assure.IsTrue(value1 === value2, buildErrorMessage);
    }

    static AreNotEqual<T>(value1: T, value2: T, buildErrorMessage: () => string) {
        Assure.IsTrue(value1 !== value2, buildErrorMessage);
    }

    static IsNotIn(value: any, array: [], buildErrorMessage: () => string) {
        Assure.IsFalse(array.some(item => item === value), buildErrorMessage);
    }
}