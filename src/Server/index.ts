import * as express from 'express';
import * as http from 'http';
import * as winston from 'winston';

import logger from '../Logger';
import Calculator from './Calculator';
import RequestReader from './RequestReader';
import ResponseWriter from './ResponseWriter';
import ServerError from './ServerError';
import StatusCode from './StatusCode';

/**
 * The server that provides the webulator web service.
 * After instantiation, run `run()` to start the server.
 */
export default class Server {
    /** The port that the server listens on. */
    private readonly port: number;

    /** Used to handle any incoming requests. */
    private readonly requestReader: RequestReader;

    /** Used to create the response object. */
    private readonly responseWriter: ResponseWriter;

    /** Used to calculate the result from the given request. */
    private readonly calculator: Calculator;

    /**
     * The server that provides the webulator web service.
     *
     * @param port The port that the server listens on.
     * @param requestReader Used to handle any incoming requests.
     * @param responseWriter Used to create the response object.
     * @param calculator Used to calculate the result from the given request.
     */
    public constructor(
        port: number,
        requestReader: RequestReader,
        responseWriter: ResponseWriter,
        calculator: Calculator,
    ) {
        this.port = port;
        this.requestReader = requestReader;
        this.responseWriter = responseWriter;
        this.calculator = calculator;
    }

    /**
     * Starts the server.
     */
    public run(): http.Server {
        const server = express();
        server.get('/calculus', this.requestHandler.bind(this));
        server.use(this.notFoundHandler.bind(this));
        server.use(this.errorHandler.bind(this));

        return server.listen(
            this.port,
            (): winston.Logger => logger.info(`server listening on port ${this.port}`),
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
        let requestContent: string;
        try {
            requestContent = this.requestReader.read(request);
            logger.info('processing request', { requestContent });
            const result: number = this.calculator.calculate(requestContent);

            return this.returnSuccess(result, response);
        } catch (error) {
            return this.handleError(error, response);
        }
    }

    /**
     * Handles any `404`s.
     *
     * @param request The incoming request.
     * @param response The outgoing response to return to the client.
     */
    private notFoundHandler(
        request: express.Request,
        response: express.Response,
    ): void {
        return this.returnError(
            new ServerError(
                StatusCode.NotFound,
                `Cannot GET ${request.url}`,
            ),
            response,
        );
    }

    /**
     * Handles any unexpected `500`s before the request handler.
     *
     * @param error The error that occurred.
     * @param _ Not used, required by interface.
     * @param response The outgoing response to write to.
     */
    private errorHandler(
        error: Error,
        _: express.Request,
        response: express.Response,
    ): void {
        return this.handleError(error, response);
    }

    /**
     * Returns a positive response that contains the result.
     *
     * @param result The calculation result.
     * @param response The response object to write to.
     */
    private returnSuccess(result: number, response: express.Response): void {
        logger.info(
            'successfully handled request',
            { result },
        );

        return this.responseWriter.write(
            StatusCode.OK,
            {
                error: false,
                result,
            },
            response,
        );
    }

    /**
     * Handles any errors and returns an appropriate response.
     *
     * @param error The error that occurred.
     * @param response The response to write to.
     */
    private handleError(error: Error, response: express.Response): void {
        if (error instanceof ServerError) {
            return this.returnError(error, response);
        }

        logger.error(
            'unexpected error',
            { error: error.toString() },
        );
        return this.returnError(
            new ServerError(StatusCode.InternalServerError, 'Unknown server error'),
            response,
        );
    }

    /**
     * Returns a negative response with given details about the error.
     *
     * @param error The error that occurred.
     * @param response The response to write to.
     */
    private returnError(error: ServerError, response: express.Response): void {
        logger.info(
            'error when processing request',
            { errorCode: error.code, errorMessage: error.message },
        );

        return this.responseWriter.write(
            error.code,
            {
                error: true,
                message: error.message,
            },
            response,
        );
    }
}
