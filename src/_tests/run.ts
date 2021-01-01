import { TestApplication } from "./_framework/test-application";
import { HelloWorldTests } from "./hello-world-tests";
import { DbContextTests } from "./db-context-tests";
import { BasicLexerTests } from "./utility/lexer/basic-lexers-tests";
import { LambdaLexersTests } from "./utility/lexer/lambda-lexers-tests";
import { SchemaTests } from "./schema/schema-tests";
import { BuilderTests } from "./expression/builder-tests";
import { CalculationLexersTests } from "./utility/lexer/calculation-lexers-tests";
import { MsSqlQueryBuilderTests } from "./query/builder/mssql/mssql-query-builder-tests";

TestApplication.Include(HelloWorldTests);
// TestApplication.Include(DbContextTests);

TestApplication.Include(BasicLexerTests);
TestApplication.Include(LambdaLexersTests);
TestApplication.Include(CalculationLexersTests);

TestApplication.Include(SchemaTests);

TestApplication.Include(BuilderTests);

TestApplication.Include(MsSqlQueryBuilderTests);

TestApplication.RunAllTests();
