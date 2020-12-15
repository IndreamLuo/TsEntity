import { TestApplication } from "./framework/test-application";
import { HelloWorldTests } from "./hello-world-tests";
import { EntitiesTests } from "./entities-tests";
import { DbContextTests } from "./db-context-tests";
import { BasicLexerTests } from "./utility/lexer/basic-lexers-tests";

TestApplication.Include(HelloWorldTests);
TestApplication.Include(EntitiesTests);
// TestApplication.Include(DbContextTests);

TestApplication.Include(BasicLexerTests)

TestApplication.RunAllTests();