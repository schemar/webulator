import 'mocha';
import { expect } from 'chai';

import RecursiveFloatCalculator from '../../../../src/Server/Calculators/RecursiveFloatCalculator';
import ServerError from '../../../../src/Server/ServerError';

const ALLOWED_DELTA = 0.0001;

interface TestInput {
    exercise: string;
    expected: number;
}

const testGivenInputs = (testInputs: TestInput[]): void => {
    const calculator = new RecursiveFloatCalculator();

    testInputs.forEach((testInput): void => {
        const result = calculator.calculate(testInput.exercise);
        expect(result).to.be.closeTo(testInput.expected, ALLOWED_DELTA);
    });
};

describe('RecursiveFloatCalculator', (): void => {
    it('returns numbers', (): void => {
        const testInputs = [
            { exercise: '1', expected: 1 },
            { exercise: '50', expected: 50 },
            { exercise: '9999', expected: 9999 },
            { exercise: '3.4', expected: 3.4 },
        ];
        testGivenInputs(testInputs);
    });

    it('adds correctly', (): void => {
        const testInputs = [
            { exercise: '1+1', expected: 2 },
            { exercise: '1+1+1', expected: 3 },
            { exercise: '5.5+6.1', expected: 11.6 },
            { exercise: '1+2+3+4+5+6', expected: 21 },
        ];
        testGivenInputs(testInputs);
    });

    it('subtracts correctly', (): void => {
        const testInputs = [
            { exercise: '1-1', expected: 0 },
            { exercise: '10-1-1', expected: 8 },
            { exercise: '5.5-6.1', expected: -0.6 },
            { exercise: '10-1-2-3', expected: 4 },
        ];
        testGivenInputs(testInputs);
    });

    it('multiplies correctly', (): void => {
        const testInputs = [
            { exercise: '2*4', expected: 8 },
            { exercise: '5*2*3', expected: 30 },
            { exercise: '5.5*3', expected: 16.5 },
            { exercise: '2*2*2*3', expected: 24 },
        ];
        testGivenInputs(testInputs);
    });

    it('divides correctly', (): void => {
        const testInputs = [
            { exercise: '2/4', expected: 0.5 },
            { exercise: '4/2', expected: 2 },
            { exercise: '16/2/2/2', expected: 2 },
            { exercise: '1.5/0.5', expected: 3 },
        ];
        testGivenInputs(testInputs);
    });

    it('orders arithmetic operators correctly', (): void => {
        const testInputs = [
            { exercise: '1+2*3', expected: 7 },
            { exercise: '3*5+4/4-2*2', expected: 12 },
            { exercise: '2*3/6+7', expected: 8 },
            { exercise: '5-10*10', expected: -95 },
        ];
        testGivenInputs(testInputs);
    });

    it('regards parentheses', (): void => {
        const testInputs = [
            { exercise: '(1+2)*3', expected: 9 },
            { exercise: '2*(23/(33))-23*(23)', expected: 2 * (23 / 33) - 23 * 23 },
        ];
        testGivenInputs(testInputs);
    });

    it('disregards spaces', (): void => {
        const testInputs = [
            { exercise: '1 + 1', expected: 2 },
            { exercise: '2 * (23/(33))- 23 * (23)', expected: 2 * (23 / 33) - 23 * 23 },
        ];
        testGivenInputs(testInputs);
    });

    it('throws for invalid input', (): void => {
        const testInputs = [
            { exercise: '1 ++ 1', expectedMessage: 'unable to parse request input part' },
            { exercise: 'ax + b', expectedMessage: 'unable to parse request input part' },
        ];

        const calculator = new RecursiveFloatCalculator();

        testInputs.forEach(
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            testInput => expect(
                (): number => calculator.calculate(testInput.exercise),
            ).to.throw(ServerError, testInput.expectedMessage),
        );
    });

    it('throws for invalid parentheses', (): void => {
        const testInputs = [
            '(1 + 1',
            '2 * (23)/(33))- 23 * (23)',
        ];

        const calculator = new RecursiveFloatCalculator();

        testInputs.forEach(
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            testInput => expect(
                (): number => calculator.calculate(testInput),
            ).to.throw(ServerError, 'parentheses do not match'),
        );
    });
});
