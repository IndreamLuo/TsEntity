import { TestApplication } from "./framework/test-application";
import { HelloWorldTests } from "./hello-world-tests";
import { EntitiesTests } from "./entities-tests";
import { DbContextTests } from "./db-context-tests";

TestApplication.Include(HelloWorldTests);
TestApplication.Include(EntitiesTests);
// TestApplication.Include(DbContextTests);

TestApplication.RunAllTests();
