import Decoder from '../Decoder';

/**
 * Decodes any given message from base64 into utf8.
 */
export default class Base64Decoder implements Decoder {
    /**
     * Decodes a base64 encoded string into a utf8 encoded string.
     *
     * @param input A base64 encoded string.
     *
     * @returns A utf8 encoded string that represents the input base64 decoded.
     */
    // eslint-disable-next-line class-methods-use-this
    public decode(input: string): string {
        const buffer = Buffer.from(input, 'base64');

        return buffer.toString('utf8');
    }
}
