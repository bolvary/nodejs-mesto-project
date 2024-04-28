import { Response, Request, NextFunction } from 'express';
import { constants } from 'http2';
import { hash } from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

import { NotFoundError } from '../helpers/errors';
import User from '../models/user';

const { SECRET } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.password = await hash(req.body.password, 10);
        const newUser = await User.create(req.body);
        return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
    } catch (error) {
        return next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then((user) => {
            const token = jwt.sign({ _id: user._id }, SECRET as Secret, { expiresIn: '7d' });

            res.send({ token });
        })
        .catch(next);
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({});

        return res.send(users);
    } catch (error) {
        return next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('Пользователь не найден');
        }
        return res.send(user);
    } catch (error) {
        return next(error);
    }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id;
        const { name, about } = req.body;
        const newInfo = await User.findByIdAndUpdate({ _id: myId }, { name, about }, {
            new: true,
            runValidators: true,
        });
        return res.send({ message: 'Данные пользователя обновлены успешно', newInfo });
    } catch (error) {
        return next(error);
    }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        return res.send(user);
    } catch (error) {
        return next(error);
    }
};

export const updateMyAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const myId = req.user._id;
        const { avatar } = req.body;

        const newAvatar = await User.findByIdAndUpdate({ _id: myId }, { avatar }, { new: true, runValidators: true });
        return res.send({ message: 'Аватарка обновлена успешно', newAvatar });
    } catch (error) {
        return next(error);
    }
};
