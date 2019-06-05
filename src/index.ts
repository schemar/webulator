#!/usr/bin/env node

import * as commander from 'commander';
import * as process from 'process';

import Base64Decoder from './Server/RequestReaders/Decoders/Base64Decoder';
import Calculator from './Server/Calculator';
import Decoder from './Server/RequestReaders/Decoder';
import JsonResponseWriter from './Server/ResponseWriters/JsonResponseWriter';
import QueryRequestReader from './Server/RequestReaders/QueryRequestReader';
import RecursiveIntegerCalculator from './Server/Calculators/RecursiveIntegerCalculator';
import RequestReader from './Server/RequestReader';
import ResponseWriter from './Server/ResponseWriter';
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
const responseWriter: ResponseWriter = new JsonResponseWriter();
const calculator: Calculator = new RecursiveIntegerCalculator();

const server: Server = new Server(commander.port, requestReader, responseWriter, calculator);
server.run();
