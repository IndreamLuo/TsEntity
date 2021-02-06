export class ExpressionBase {
    Id: number = ++ExpressionBase.IdSeed;

    private static IdSeed = 0;
}