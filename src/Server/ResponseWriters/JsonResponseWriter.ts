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
    public write(
        code: StatusCode,
        payload: object,
        response: {
            statusCode: number;
            end: (chunk: any) => void;
        },
    ): void {
        response.statusCode = code;
        return response.end(JSON.stringify(payload));
    }
}
