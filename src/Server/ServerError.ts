/** Possible HTTP status codes of this application. */
export enum StatusCode {
    BadRequest = 400,
}

/** A ServerError is an error that can occur during request handling. */
export class ServerError extends Error {
    /** The HTTP status code of this error. */
    public readonly code: StatusCode;

    /** The message that shall be presented to the client in the response. */
    public readonly message: string;

    /**
     * A ServerError is an error that can occur during request handling.
     *
     * @param code The HTTP status code of this error.
     * @param message The message that shall be presented to the client in the response.
     */
    public constructor(code: StatusCode, message: string) {
        super(message);

        this.code = code;
        this.message = message;
    }
}
