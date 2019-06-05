import * as express from 'express';

import StatusCode from './StatusCode';

export default interface ResponseWriter {
    write(code: StatusCode, payload: object, response: express.Response): void;
} // eslint-disable-line semi
