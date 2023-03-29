import winston from 'winston';

const customLevelOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: "white",
        http: "gray",
        info: "blue",
        warning: "yellow",
        error: "orange",
        fatal: "red"
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ 
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ color: customLevelOptions.colors }),
                winston.format.simple()
            ) 
        }),
        new winston.transports.Console({ 
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ color: customLevelOptions.colors }),
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

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)

    next()
}