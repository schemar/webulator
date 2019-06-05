import Calculator from '../Calculator';

export default class RecursiveIntegerCalculator implements Calculator {
    public calculate(input: string): number {
        if (input) return 1;
        return 0;
    }
}
