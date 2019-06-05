import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import Decoder from '../../../../src/Server/RequestReaders/Decoders/Base64Decoder';
import QueryRequestReader from '../../../../src/Server/RequestReaders/QueryRequestReader';
import ServerError from '../../../../src/Server/ServerError';

describe('QueryRequestReader', (): void => {
    it('reads a string from a query "query"', (): void => {
        const decoder = sinon.createStubInstance(Decoder);
        decoder.decode.returnsArg(0);
        const reader = new QueryRequestReader(decoder);

        const request = { query: { query: 'testString' } };
        const read = reader.read(request);

        expect(read).to.equal('testString');
        expect(decoder.decode.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('throws if there is no query "query"', (): void => {
        const decoder = sinon.createStubInstance(Decoder);
        const reader = new QueryRequestReader(decoder);

        const request = { query: {} };

        expect((): string => reader.read(request)).to.throw(ServerError, 'Missing a query parameter "query".');
    });

    it('throws if the query "query" is not a string', (): void => {
        const decoder = sinon.createStubInstance(Decoder);
        const reader = new QueryRequestReader(decoder);

        const request = { query: { query: 1337 } };

        expect((): string => reader.read(request)).to.throw(ServerError, 'Missing a query parameter "query".');
    });
});
