import { StringDictionary } from "../../utilities/types/dictionaries";
import { TestConfiguration } from "./test-configuration";

export class TestApplication {
    static Include(type: { new(...args: any[]): any}) { }

    static RunAllTests() {
        let all = 0;
        let success = 0;
        let failed = 0;

        (async () => {
            await Promise.all(Object.keys(TestConfiguration.TestClasses).map(async key => {
                await Promise.all(TestConfiguration.TestClasses[key].map(async testClass => {
                    let allOfClass = 0;
                    let successOfClass = 0;
                    let failedOfClass = 0;

                    let tests = new testClass.Constructor();
                    if (tests.init) {
                        let init = tests.init();
                        if (init && init.constructor === Promise) {
                            await init;
                        }
                    }

                    let errors: StringDictionary<string> = {};

                    await Promise.all(testClass.Tests.map(async test => {
                        allOfClass++;

                        try {
                            let result = tests[test]();
                            if (result && result.constructor === Promise) {
                                await result;
                            }
                            successOfClass++;
                        } catch(error) {
                            failedOfClass++;
                            errors[test] = error;
                        }
                    }));

                    if (tests.dispose) {
                        let dispose = tests.dispose();
                        if (dispose && dispose.constructor === Promise) {
                            await dispose;
                        }
                    }
                    
                    (successOfClass == allOfClass ? console.info : console.error)(`[${tests.constructor.name}]: (${successOfClass}/${allOfClass})`);

                    Object.keys(errors).forEach(test => {
                        console.error(test);
                        console.error(errors[test]);
                    })

                    all += allOfClass;
                    success += successOfClass;
                    failed += failedOfClass;
                }));
            }));

            (success === all ? console.info : console.error)(`All success: (${success}/${all})`);
        })();

    }
}