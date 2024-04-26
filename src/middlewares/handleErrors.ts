import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongoodeError } from 'mongoose';

import { BadRequestError, ConflictError } from '../helpers/errors';

export interface IError extends Error {
    statusCode?: number;
}

const handleErrors = (err: IError & MongoodeError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    let message = err.message || 'Ошибка на стороне сервера';

    if (err.message.startsWith('E11000')) {
        const error = new ConflictError();
        statusCode = error.statusCode;
        message = error.message;
    }

    if (err instanceof MongoodeError.ValidationError) {
        const error = new BadRequestError();
        statusCode = error.statusCode;
        message = error.message;
    }

    if (err instanceof MongoodeError.CastError) {
        const error = new BadRequestError();
        statusCode = error.statusCode;
        message = error.message;
    }

    res.status(statusCode).send({ error: message, stackTrace: err.stack });
    next();
};

export default handleErrors;
