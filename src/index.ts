#!/usr/bin/env node

import * as commander from 'commander';
import * as process from 'process';

import Base64Decoder from './Server/RequestReaders/Decoders/Base64Decoder';
import Decoder from './Server/RequestReaders/Decoder';
import QueryRequestReader from './Server/RequestReaders/QueryRequestReader';
import RequestReader from './Server/RequestReader';
import Server from './Server';

const DEFAULT_PORT = 80;

commander
    .version('0.1.0')
    .option('-p, --port [port]', 'The port that the server listens on', Number.parseInt)
    .parse(process.argv);

if (!commander.port) {
    commander.port = DEFAULT_PORT;
}

const decoder: Decoder = new Base64Decoder();
const requestReader: RequestReader = new QueryRequestReader(decoder);
const server: Server = new Server(commander.port, requestReader);
server.run();
