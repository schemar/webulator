import Calculator from '../Calculator';
import ServerError from '../ServerError';
import StatusCode from '../StatusCode';

/**
 * A calculator implementation that recursively calculates the result from the input, parsing
 * numbers as float.
 */
export default class RecursiveFloatCalculator implements Calculator {
    /** A regular expression to identify floating point numbers. */
    private readonly numberRegex: RegExp = /^[+-]?[0-9]+(\.[0-9]+)?$/;

    /**
     * All supported arithmetic operations. The order is important and should be "applied last" to
     * "applied first" top to bottom.
     * More important operations are later in the array because of how the code will recursively
     * split the string, thus doing the last operation first when returning back up the recursion
     * tree.
     */
    private readonly arithmeticOperations = [
        { splitSymbol: '-', operation: (a: number, b: number): number => a - b },
        { splitSymbol: '+', operation: (a: number, b: number): number => a + b },
        { splitSymbol: '/', operation: (a: number, b: number): number => a / b },
        { splitSymbol: '*', operation: (a: number, b: number): number => a * b },
    ];

    /**
     * Calculate the result from a given mathematical expression.
     *     Examples of inputs could be `1 + 1` or also more complex expressions like
     *     `2 * (23/(33))- 23 * (23)`.
     *
     * @param input The input string to operate on.
     *
     * @returns The resulting number from the input.
     *
     * @throws A ServerError, if the input cannot be parsed correctly.
     */
    public calculate(input: string): number {
        const cleaned: string = RecursiveFloatCalculator.removeSpaces(input);
        if (this.numberRegex.test(cleaned)) {
            return Number.parseFloat(cleaned);
        }

        if (cleaned.indexOf('(') > -1) {
            return this.resolveParentheses(cleaned);
        }

        return this.applyArithmeticsInOrder(cleaned);
    }

    /**
     * Cleans a given string by removing all whitespace characters from it.
     *
     * @param input The input string to clean.
     *
     * @returns The cleaned string.
     */
    private static removeSpaces(input: string): string {
        return input.replace(/\s/g, '');
    }

    /**
     * Applies all known arithmetics to the given mathematical expression (in order).
     *
     * @param input The input string to operate on.
     * @returns The resulting number from the given expression.
     */
    private applyArithmeticsInOrder(input: string): number {
        const { length } = this.arithmeticOperations;
        for (let i = 0; i < length; i += 1) {
            const operation = this.arithmeticOperations[i];
            const splitIndex = input.lastIndexOf(operation.splitSymbol);
            if (splitIndex > -1) {
                return operation.operation(
                    this.calculate(input.substring(0, splitIndex)),
                    this.calculate(input.substring(splitIndex + 1)),
                );
            }
        }

        throw new ServerError(StatusCode.BadRequest, `unable to parse request input part ${input}`);
    }

    /**
     * Finds a matching pair of (outer) parentheses in a given mathematical expression and makes
     *     sure that the part between the parentheses is calculated first.
     *
     * @param input The mathematical expression to operate on.
     *
     * @returns The number that results from the expression.
     */
    private resolveParentheses(input: string): number {
        const { length } = input;
        let openParenthesesCount = 0;
        let startIndex = -1;
        let endIndex = -1;
        for (let i = 0; i < length; i += 1) {
            const char = input.charAt(i);
            if (char === '(') {
                openParenthesesCount += 1;
                if (openParenthesesCount === 1) {
                    startIndex = i;
                }
            } else if (char === ')') {
                openParenthesesCount -= 1;
                if (openParenthesesCount === 0) {
                    endIndex = i;

                    break;
                }
            }
        }

        return this.splitAroundParentheses(input, startIndex, endIndex);
    }

    /**
     * Splits a mathematical expression around a pair of parentheses. It returns the result of
     *     calculating the the expression after replacing the inners of the parentheses with their
     *     result.
     *
     * @param input The mathematical expression to operate on.
     * @param startIndex The index of the opening parenthesis.
     * @param endIndex The index of the accompanying closing parenthesis.
     *
     * @returns The resulting number from executing the given mathematical expression.
     */
    private splitAroundParentheses(input: string, startIndex: number, endIndex: number): number {
        if (startIndex < 0 || endIndex < 0) {
            throw new ServerError(StatusCode.BadRequest, 'parentheses do not match');
        }

        return this.calculate(
            input.substring(0, startIndex)
            + this.calculate(input.substring(startIndex + 1, endIndex)).toString(10)
            + input.substring(endIndex + 1),
        );
    }
}
