export class TestClassConfiguration {
    constructor (public Constructor: { new(): any }) { }

    Tests: string[] = [];
}

export class TestConfiguration {
    static TestClasses: {
        [key: string]: TestClassConfiguration[]
    } = {};

    static AddAndGetTestClass(constructor: { new(): any }): TestClassConfiguration {
        let classes = (this.TestClasses[constructor.name] = this.TestClasses[constructor.name] || []);

        for (let index in classes) {
            if (classes[index].constructor == constructor) {
                return classes[index];
            }
        }

        let result = new TestClassConfiguration(constructor);

        classes.push(result);

        return result;
    }

    static AddTest(constructor: { new(): any }, test: string) {
        let testClass = this.AddAndGetTestClass(constructor);
        testClass.Tests.push(test);
    }
}