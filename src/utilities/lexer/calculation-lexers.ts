import { CalculationExpression } from "./expressions/calculation-expression";
import { Lexer } from "./lexers/lexer";

export class CalculationLexers {
    static Calculation = new Lexer("Calculation", [], node => {
        
    });
}
