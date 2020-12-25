import { StringDictionary } from "../../utilities/types/dictionaries";
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
                let errors: StringDictionary<string> = {};

                testClass.Tests.forEach(test => {
                    allOfClass++;

                    try {
                        tests[test]();
                        successOfClass++;
                    } catch(error) {
                        failedOfClass++;
                        errors[test] = error;
                    }
                });
                
                if (successOfClass == allOfClass) {
                    console.info(`[${tests.constructor.name}]: (${successOfClass}/${allOfClass})`);
                } else {
                    console.error(`[${tests.constructor.name}]: (${successOfClass}/${allOfClass})`);
                }

                Object.keys(errors).forEach(test => {
                    console.error(test);
                    console.error(errors[test]);
                })

                all += allOfClass;
                success += successOfClass;
                failed += failedOfClass;
            });
        });

        console.info(`All success: (${success}/${all})`);
    }
}