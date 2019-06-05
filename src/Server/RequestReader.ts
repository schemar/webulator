import * as express from 'express';

export default interface RequestReader {
    read(request: express.Request): string;
}
