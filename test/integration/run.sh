#!/bin/bash

RETURN_CODE="0"

node build/index.js -p 35000 &
SERVER_PID=$!
sleep 3

npm run mocha -- test/integration/index.test.ts || RETURN_CODE="1"

kill -KILL $SERVER_PID

echo "INTEGRATION TESTS DONE"
exit $RETURN_CODE
