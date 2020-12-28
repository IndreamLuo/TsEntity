export {}

declare global {
    interface String {
        toLexerString(): string;
    }
}

String.prototype.toLexerString = function () {
    let result = '';

    for (var index = 0; index < this.length; index++) {
        switch (this[index]) {
            case '.':
            case '|':
            case '(':
            case ')':
            case '+':
            case '*':
            case '?':
                result += `\\${this[index]}`;
                break;
            default:
                result += this[index];
        }
    }

    return result;
}
