import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import JsonResponseWriter from '../../../../src/Server/ResponseWriters/JsonResponseWriter';

describe('JsonResponseWriter', (): void => {
    it('returns an object JSON encoded', (): void => {
        const testStatusCode = 200;
        const testPayload = {
            foo: 'bar',
            bar: 3,
        };
        const end = sinon.fake();
        const response = {
            statusCode: 0,
            end,
        };

        const writer = new JsonResponseWriter();
        writer.write(
            testStatusCode,
            testPayload,
            response,
        );

        // eslint-disable-next-line no-unused-expressions
        expect(end.calledOnceWith(JSON.stringify(testPayload))).to.be.true;
    });

    it('returns the correct status code', (): void => {
        const testStatusCode = 200;
        const testPayload = {};
        const end = sinon.fake();
        const response = {
            statusCode: 0,
            end,
        };

        const writer = new JsonResponseWriter();
        writer.write(
            testStatusCode,
            testPayload,
            response,
        );

        expect(response.statusCode).to.equal(200);
    });
});
