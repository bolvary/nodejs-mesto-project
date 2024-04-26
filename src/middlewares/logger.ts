import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile = require('winston-daily-rotate-file');

const errorTransport = new DailyRotateFile({
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '10m',
    maxFiles: 3,
});

const requestTransport = new DailyRotateFile({
    filename: 'request-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '10m',
    maxFiles: 3,
});

export const requestLogger = expressWinston.logger({
    transports: [
        requestTransport,
    ],
    format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
    transports: [
        errorTransport,
    ],
    format: winston.format.json(),
});
