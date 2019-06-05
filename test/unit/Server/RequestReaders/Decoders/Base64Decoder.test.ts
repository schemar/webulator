import 'mocha';
import { expect } from 'chai';
import Base64Decoder from '../../../../../src/Server/RequestReaders/Decoders/Base64Decoder';

describe('Base64Decoder', (): void => {
    it('decodes base64 encoded strings', (): void => {
        const testInputs: string[] = [
            'one',
            'two',
            'foo',
            'bar',
            'JGnJKPqpB7KPyQpgyXxPORIC4EJAT72WoO6Kag2KiTxCiy7g85yn5edwh9wOSywziEFPnXLK4GhSF8Li',
            '((((((]]]',
            '1 + 1',
            '3 * (3+    4)',
            '2 * (23/(33))- 23 * (23)',
        ];

        const decoder: Base64Decoder = new Base64Decoder();

        testInputs.forEach((testInput: string): void => {
            const encoded = Buffer.from(testInput).toString('base64');
            const decoded = decoder.decode(encoded);

            expect(decoded).to.equal(testInput);
        });
    });
});
