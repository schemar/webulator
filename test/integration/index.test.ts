import 'mocha';
import * as http from 'http';
import { expect } from 'chai';

// Must match port given in `run.sh`
const port = 35000;

describe('Integration test', async (): Promise<void> => {
    it('receives a valid response', async (): Promise<void[]> => {
        const testInputs = [
            {
                request: 'MiAqICgyMy8oMzMpKS0gMjMgKiAoMjMp',
                expectedStatusCode: 200,
                expectedResult: { error: false, result: -527.6060606060606 },
            },
            {
                request: 'MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk',
                expectedStatusCode: 200,
                expectedResult: { error: false, result: -132.88888888888889 },
            },
            {
                request: 'MjcgKiAoMyArMykpIC0gNA==',
                expectedStatusCode: 400,
                expectedResult: { error: true, message: 'unable to parse request input part 6)' },
            },
            {
                request: 'MjcgKiAoMyArMyAtIDQ=',
                expectedStatusCode: 400,
                expectedResult: { error: true, message: 'parentheses do not match' },
            },
        ];

        return Promise.all(
            testInputs.map(
                (testInput): Promise<void> => new Promise(
                    (resolve): void => {
                        http.get(
                            `http://127.0.0.1:${port}/calculus?query=${testInput.request}`,
                            (response): void => {
                                expect(response.statusCode).to.equal(testInput.expectedStatusCode);
                                expect(response.headers['content-type']).to.equal('application/json');

                                response.setEncoding('utf8');
                                let rawData = '';
                                response.on('data', (chunk): void => { rawData += chunk; });
                                response.on('end', (): void => {
                                    const parsedData = JSON.parse(rawData);
                                    expect(parsedData).to.deep.equal(testInput.expectedResult);

                                    resolve();
                                });
                            },
                        );
                    },
                ),
            ),
        );
    });
});
