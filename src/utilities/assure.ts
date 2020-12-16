export class Assure {
    static AreEqual<T>(value1: T, value2: T, buildErrorMessage: () => string) {
        if (value1 !== value2) {
            throw Error(buildErrorMessage());
        }
    }
}