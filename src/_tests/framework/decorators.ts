import { TestConfiguration } from "./test-configuration";

export function tests() {
    return (constructor: any) => {
        TestConfiguration.AddAndGetTestClass(constructor);

        return constructor;
    }
}

export function test() {
    return (object: Object, propertyName: string) => {
        TestConfiguration.AddTest(object.constructor as { new(): any }, propertyName);
    }
}