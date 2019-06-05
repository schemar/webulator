import ResponseWriter from '../ResponseWriter';
import StatusCode from '../StatusCode';

/** Writes the response as JSON to the response body. */
export default class JsonResponseWriter implements ResponseWriter {
    /**
     * Writes the response as JSON to the response body.
     *
     * @param code The HTTP status code of the response.
     * @param payload The response payload, will be JSON encoded in the response body.
     * @param response The response object to write to.
     */
    // eslint-disable-next-line class-methods-use-this
    public write(
        code: StatusCode,
        payload: object,
        response: {
            statusCode: number;
            end: (chunk: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
            setHeader: (key: string, value: string) => void;
        },
    ): void {
        response.statusCode = code;
        response.setHeader('content-type', 'application/json');
        return response.end(JSON.stringify(payload));
    }
}
