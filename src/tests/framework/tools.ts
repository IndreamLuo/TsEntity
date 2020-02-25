export function assert(assertion: boolean | Function, errorMessage: string | null = null) {
    if (assertion instanceof Function) {
        assertion = assertion();
    }

    if (!assertion) {
        throw new Error(errorMessage || `Value doesn't match condition.`);
    }
}