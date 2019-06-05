import * as http from 'http';
import * as express from 'express';

import logger from '../Logger';
import RequestReader from './RequestReader';
import { ServerError } from './ServerError';

/**
 * The server that provides the webulator web service.
 * After instantiation, run `run()` to start the server.
 */
export default class Server {
    /** The port that the server listens on. */
    private readonly port: number;

    /** Used to handle any incoming requests. */
    private readonly requestReader: RequestReader;

    /**
     * The server that provides the webulator web service.
     *
     * @param port The port that the server listens on.
     * @param requestReader Used to handle any incoming requests.
     */
    public constructor(port: number, requestReader: RequestReader) {
        this.port = port;
        this.requestReader = requestReader;
    }

    /**
     * Starts the server.
     */
    public run(): http.Server {
        const server = express();
        server.get('/calculus', this.requestHandler.bind(this));

        return server.listen(
            this.port,
            () => logger.info(`server listening on port ${this.port}`),
        );
    }

    /**
     * Handles any incoming requests and sends a reply using the response.
     *
     * @param request The incoming request.
     * @param response The outgoing response to return to the client.
     */
    private requestHandler(
        request: express.Request,
        response: express.Response,
    ): void {
        let requestMessage: string;
        try {
            requestMessage = this.requestReader.read(request);
        } catch (error) {
            logger.info(
                'error when processing request',
                { errorCode: error.code, errorMessage: error.message },
            );
            if (error instanceof ServerError) {
                response.statusCode = error.code;
                return response.end(error.message);
            }

            response.statusCode = 500;
            return response.end('Unknown server error.');
        }

        logger.info('processing request', { requestMessage });
        // TODO: actual calculation

        return response.end(requestMessage);
    }
}
