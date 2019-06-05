import 'mocha';
import { expect } from 'chai';
import Base64Decoder from '../../../../../src/Server/RequestReaders/Decoders/Base64Decoder';

describe('QueryRequestReader', (): void => {
    it('decodes base64 encoded strings', (): void => {
        const testStrings: string[] = [
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

        testStrings.forEach((testString: string): void => {
            const encoded = Buffer.from(testString).toString('base64');
            const decoded = decoder.decode(encoded);

            expect(decoded).to.equal(testString);
        });
    });
});
