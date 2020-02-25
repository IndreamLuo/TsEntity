import { TestConfiguration } from "./test-configuration";

export class TestApplication {
    static Include(type: { new(...args: any[]): any}) { }

    static RunAllTests() {
        let all = 0;
        let success = 0;
        let failed = 0;

        Object.keys(TestConfiguration.TestClasses).forEach(key => {
            TestConfiguration.TestClasses[key].forEach(testClass => {
                let tests = new testClass.Constructor();
                testClass.Tests.forEach(test => {
                    all++;

                    try {
                        tests[test]();
                        success++;
                    } catch(error) {
                        failed++;
                        console.error(error);
                    }
                });
            });
        });

        console.info(`Success: ${success}/${all} | Failed: ${failed}/${all}`);
    }
}