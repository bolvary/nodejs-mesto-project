import { Response, Request, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { AutorizationError } from '../helpers/errors';

const { SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new AutorizationError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
        payload = jwt.verify(token, SECRET as Secret);
    } catch (err) {
        throw new AutorizationError('Необходима авторизация');
    }

    req.user = payload as { _id: ObjectId };

    next();
};
