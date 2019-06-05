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
        const setHeader = sinon.fake();
        const response = {
            statusCode: 0,
            end,
            setHeader,
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
        const setHeader = sinon.fake();
        const response = {
            statusCode: 0,
            end,
            setHeader,
        };

        const writer = new JsonResponseWriter();
        writer.write(
            testStatusCode,
            testPayload,
            response,
        );

        expect(response.statusCode).to.equal(200);
    });

    it('returns the correct content type', (): void => {
        const testStatusCode = 200;
        const testPayload = {};
        const end = sinon.fake();
        const setHeader = sinon.fake();
        const response = {
            statusCode: 0,
            end,
            setHeader,
        };

        const writer = new JsonResponseWriter();
        writer.write(
            testStatusCode,
            testPayload,
            response,
        );

        // eslint-disable-next-line no-unused-expressions
        expect(response.setHeader.calledOnceWith('content-type', 'application/json')).to.be.true;
    });
});
