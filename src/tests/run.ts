import { TestApplication } from "./framework/test-application";
import { HelloWorldTests } from "./hello-world-tests";
import { EntitiesTests } from "./entities-tests";

TestApplication.Include(HelloWorldTests);
TestApplication.Include(EntitiesTests);

TestApplication.RunAllTests();