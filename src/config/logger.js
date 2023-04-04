import winston, { createLogger } from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ 
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ) 
        }),
        new winston.transports.Console({ 
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ) 
        }),
        new winston.transports.File({ 
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

export const buildDevLogger = () => {
    const logger = createLogger({
        transports: [
            new winston.transports.Console({ 
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ) 
            }),
            new winston.transports.File({ 
                filename: "./errors.log",
                level: "error",
                format: winston.format.simple()
            })
        ]
    })
}

export const buildProdLogger = () => {
    const logger = createLogger({
        transports: [
            new winston.transports.Console({ 
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ) 
            }),
            new winston.transports.File({ 
                filename: "./errors.log",
                level: "error",
                format: winston.format.simple()
            })
        ]
    })
}

// export const addLogger = (req, res, next) => {
//     req.logger = logger
//     req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)

//     next()
// }