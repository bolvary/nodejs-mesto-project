import { Response, Request } from 'express';
import { constants } from 'http2';
import { Error as MongoodeError } from 'mongoose';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
        .then((user) => {
        // создадим токен
        const token = jwt.sign({ _id: user._id }, 'some-secret-key');
    
        // вернём токен
        res.send({ token });
        })
        .catch((err) => {
        res
            .status(401)
            .send({ message: err.message });
        });
}; 

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});

        return res.send(users);
    } catch (error) {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        return res.send(user);
    } catch (error) {
        if (error instanceof MongoodeError.CastError) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                message: 'Пользователь по указанному _id не найден',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create(req.body);
        return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
    } catch (error) {
        if (error instanceof MongoodeError.ValidationError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Переданы некорректные данные при создании пользователя',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const myId = req.user._id;
        const { name, about } = req.body;

        if (!myId) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                message: 'Пользователь с указанным _id не найден',
            });
        }

        await User.findByIdAndUpdate({ _id: myId }, { name, about }, { new: true, runValidators: true });
        return res.send({ message: 'Данные пользователя обновлены успешно' });
    } catch (error) {
        if (error instanceof MongoodeError.ValidationError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Переданы некорректные данные при создании пользователя',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const updateMyAvatar = async (req: Request, res: Response) => {
    try {
        const myId = req.user._id;
        const { avatar } = req.body;

        await User.findByIdAndUpdate({ _id: myId }, { avatar }, { new: true, runValidators: true });
        return res.send({ message: 'Аватарка обновлена успешно' });
    } catch (error) {
        if (error instanceof MongoodeError.ValidationError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Переданы некорректные данные при обновлении аватара',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};
