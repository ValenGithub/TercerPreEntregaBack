import winston from "winston";
import enviroment from "../config/enviroment.js";

const { combine, timestamp, printf, colorize } = winston.format;

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'white',
};

winston.addColors(colors);

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
    format: combine(
        colorize({ all: true }),
        timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
        }),
        new winston.transports.File({ filename: 'register.log', level: 'warn' }),
    ],
});

if (enviroment.NODE_ENV === 'production') {
    logger.add(
        new winston.transports.File({ filename: 'production.log', level: 'info' })
    );
}

export const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')}`);
    next();
};

export const errorHandlerMiddleware = (err, req, res, next) => {
    logger.error(`Error Code: ${err.code} - ${err.message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    
    switch (err.code) {
        case ErrorCodes.INVALID_TYPE:
            res.render('dataerror')
            break;
      
        default:
            res.render('errorservidor');
            break;
    }
};