import { Schema } from "../../schema/schema";
import { CalculationExpression } from "../../utilities/lexer/expressions/calculation-expression";
import { SelectFieldExpression } from "../../utilities/lexer/expressions/select-field-expression";
import { LambdaLexers } from "../../utilities/lexer/lambda-lexers";
import { StringDictionary } from "../../utilities/types/dictionaries";
import { Operator } from "../../utilities/types/operators";
import { EntityExpressionBase } from "../expressions/base/entity-expression-base";
import { ValueExpressionBase } from "../expressions/base/value-expression-base";
import { CalculateExpression } from "../expressions/component/calculate-expression";
import { ColumnExpression } from "../expressions/component/column-expression";
import { ConstantExpression } from "../expressions/component/constant-expression";
import { NotExpression } from "../expressions/component/not-expression";
import { TokenExpression } from "../expressions/component/token-expression";
import { FilterExpression } from "../expressions/filter-expression";
import { ReferenceExpression } from "../expressions/reference-expression";

declare module "../expressions/base/entity-expression-base" {
    interface EntityExpressionBase<T> {
        Filter(condition: (item: T) => Boolean): FilterExpression<T>;
        Filter(parameters: any[], condition: (item: T, param1: any, param2: any) => Boolean): FilterExpression<T>;
    }
}

EntityExpressionBase.prototype.Filter = filter;

function filter<T>(this: EntityExpressionBase<T>, condition: any[] | ((item: T) => Boolean)): FilterExpression<T>;
function filter<T>(this: EntityExpressionBase<T>, parameters: any[] | ((item: T) => Boolean), condition?: (item: T, ...parameters: []) => Boolean): FilterExpression<T> {
    if (typeof(parameters) === 'function') {
        condition = parameters;
        parameters = [];
    }

    parameters = [this.Token()].concat(parameters);

    let conditionExpression = condition!.toString();
    let calculationExpressionLambdaTreeNode = LambdaLexers.CalculationLambda.Parse(conditionExpression);

    let parametersExpression = calculationExpressionLambdaTreeNode.Expression!.Parameters;
    let referencedParameters: StringDictionary<any> = {};
    parametersExpression.forEach((parameterExpression, index) => referencedParameters[parameterExpression] = (parameters as [])[index]);

    let calculationExpression = calculationExpressionLambdaTreeNode.Expression!.Expression;

    let calculateExpression = ConvertParsedToCalculationExpression(this.Schema, referencedParameters, calculationExpression);
    
    return new FilterExpression(this, calculateExpression);
}

function ConvertParsedToCalculationExpression(schema: Schema, parameters: StringDictionary<any>, calculationExpression: CalculationExpression): ValueExpressionBase<any> {
    switch (calculationExpression.Operator) {
        case Operator.Prior:
            return ConvertParsedToCalculationExpression(schema, parameters, calculationExpression.Left as CalculationExpression);
        case Operator.Is:
            switch (typeof(calculationExpression.Left)) {
                case 'boolean':
                    return new ConstantExpression<Boolean>(calculationExpression.Left);
                case 'number':
                    return new ConstantExpression<Number>(calculationExpression.Left);
                case 'string':
                    return new ConstantExpression<String>(calculationExpression.Left);
                case 'object':
                    return ConvertParsedToTokenExpression(schema, parameters, calculationExpression.Left as SelectFieldExpression);
            }
        case Operator.Not:
            return new NotExpression(ConvertParsedToCalculationExpression(schema, parameters, calculationExpression.Left as CalculationExpression));
        case Operator.And:
        case Operator.Or:
        case Operator.Plus:
        case Operator.Minus:
        case Operator.MultiplyBy:
        case Operator.DividedBy:
        case Operator.EqualTo:
        case Operator.NotEqualTo:
        case Operator.GreaterThan:
        case Operator.NoLessThan:
        case Operator.LessThan:
        case Operator.NoGreaterThan:
            return new CalculateExpression(
                calculationExpression.Operator,
                ConvertParsedToCalculationExpression(schema, parameters, calculationExpression.Left as CalculationExpression),
                ConvertParsedToCalculationExpression(schema, parameters, calculationExpression.Right as CalculationExpression)
            )
    }
}

function ConvertParsedToTokenExpression(schema: Schema, parameters: StringDictionary<any>, parsed: SelectFieldExpression): ValueExpressionBase<any> {
    let field = parsed.Field;
    let identifier = typeof(parsed.Identifier) !== 'string'
        ? ConvertParsedToTokenExpression(schema, parameters, parsed.Identifier as SelectFieldExpression)
        : parameters[parsed.Identifier as string];

    if (identifier === undefined) {
        throw SyntaxError(`Parameter "${parsed.Identifier}" is not in input parameters. For parameter(s) other than token, a parameter is needed. For example: companies.fileter([b, now], (company, b) => company.Id == 0 && b.Date == now)`);
    }

    if (identifier.constructor === TokenExpression || identifier.constructor === ReferenceExpression) {
        let entityDiagram = schema.GetOrAddEntity(identifier.EntityConstructor);
        let relationship = entityDiagram.GetRelationship(field);
        
        if (relationship == null) {
            return identifier.Column(field);
        }

        return new ReferenceExpression(identifier, relationship);
    } else if (identifier.constructor === ColumnExpression) {
        throw Error();
    }

    throw Error();
}