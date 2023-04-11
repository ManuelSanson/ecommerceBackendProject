import winston from 'winston';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({
        timestamp,
        level,
        message
    }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

const productionLogger = winston.createLogger({
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./errors.log",
            level: 'error'
        })
    ]
});

const developmentLogger = winston.createLogger({
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    level: 'debug',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./errors.log",
            level: 'error'
        })
    ]
});

export let logger;
if (process.env.NODE_ENV === 'production') {
    logger = productionLogger;
} else {
    logger = developmentLogger;
}