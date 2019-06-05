# Webulator

Webulator can return responses to mathematical requests.
For example, webulator can return `-527.6060606060606` as the result of the
request `2 * (23/(33))- 23 * (23)`.

## Running webulator

Requirements: node and npm.
To run webulator:

```bash
git clone https://github.com/schemar/webulator.git
cd webulator
npm ci
npm start
```

By default, webulator tries to start on port `80`. You can specify a different
port with the `--port` option. To listen, for example, on port `35000`:

```bash
npm start -- --port 35000
```

## Accessing webulator

Access webulator under the route `/calculus` with a Base64 encoded query as a
`query` query parameter. Example:

```
# base64("2 * (23/(33))- 23 * (23)") => MiAqICgyMy8oMzMpKS0gMjMgKiAoMjMp
curl http://example.com/calculus?query=MiAqICgyMy8oMzMpKS0gMjMgKiAoMjMp

# Response: {"error":false,"result":-527.6060606060606}
```

The response status code is `200` on success, or `4xx`/`5xx` if there is an error.
The response body is:

* in the success case: `{"error":false,"result":<float>}`
* in the error case: `{"error":true,"message":<string>}`

## Testing

Run `npm test` to run all tests: linting, unit tests, and integration tests.
