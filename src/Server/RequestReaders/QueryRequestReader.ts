import Decoder from './Decoder';
import RequestReader from '../RequestReader';
import ServerError from '../ServerError';
import StatusCode from '../StatusCode';

/**
 * A request handler that gets the request payload from a query parameter called "query".
 */
export default class QueryRequestReader implements RequestReader {
    /** The decoder used to decode any request payload. */
    private readonly decoder: Decoder;

    /**
     * A request handler that gets the request payload from a query parameter called "query".
     *
     * @param decoder The decoder used to decode any request payload.
     */
    public constructor(decoder: Decoder) {
        this.decoder = decoder;
    }

    /**
     * Read the payload from the request. Decodes the payload from the query parameter "query" and
     *     returns the result.
     *
     * @param request The incoming request. Must have a `query` property. For example an express
     *     request.
     *
     * @returns The decoded payload.
     *
     * @throws A ServerError if it cannot read the `query` query key from the given request.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public read(request: { query: any }): string {
        if (typeof request.query.query !== 'string') {
            throw new ServerError(StatusCode.BadRequest, 'Missing a query parameter "query".');
        }

        const message: string = request.query.query;
        const decoded: string = this.decoder.decode(message);

        return decoded;
    }
}
