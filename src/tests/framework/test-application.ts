import { TestConfiguration } from "./test-configuration";

export class TestApplication {
    static Include(type: { new(...args: any[]): any}) { }

    static RunAllTests() {
        let all = 0;
        let success = 0;
        let failed = 0;

        Object.keys(TestConfiguration.TestClasses).forEach(key => {
            TestConfiguration.TestClasses[key].forEach(testClass => {
                let allOfClass = 0;
                let successOfClass = 0;
                let failedOfClass = 0;

                let tests = new testClass.Constructor();
                testClass.Tests.forEach(test => {
                    allOfClass++;

                    try {
                        tests[test]();
                        successOfClass++;
                    } catch(error) {
                        failedOfClass++;
                        console.error(error);
                    }
                });
                
                console.info(`[${tests.constructor.name}]: Success(${successOfClass}/${allOfClass}) | Failed(${failedOfClass}/${allOfClass})`);

                all += allOfClass;
                success += successOfClass;
                failed += failedOfClass;
            });
        });

        console.info(`All: Success(${success}/${all}) | Failed(${failed}/${all})`);
    }
}