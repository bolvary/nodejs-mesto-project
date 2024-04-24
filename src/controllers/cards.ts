import { Response, Request } from 'express';
import { constants } from 'http2';
import { Error as MongoodeError } from 'mongoose';

import Card from '../models/card';

export const getCards = async (req: Request, res: Response) => {
    try {
        const cards = await Card.find({});
        return res.status(constants.HTTP_STATUS_CREATED).send(cards);
    } catch (error) {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const deleteCardById = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.params;
        const removeCard = Card.findById(cardId);

        await removeCard.deleteOne();
        return res.send({ message: 'Карточка удалена' });
    } catch (error) {
        if (error instanceof MongoodeError.CastError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Карточка с указанным _id не найдена',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const createCard = async (req: Request, res: Response) => {
    try {
        req.body.owner = req.user._id;
        const newCard = await Card.create(req.body);
        return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
    } catch (error) {
        if (error instanceof MongoodeError.ValidationError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Переданы некорректные данные при создании карточки',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const likeCard = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const { cardId } = req.params;
        if (!cardId) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }

        await Card.findByIdAndUpdate(
            {
                _id: cardId,
                likes: { $nin: [userId] },
            },
            { $addToSet: { likes: userId } },
            { new: true },
        );
        return res.send({ message: 'Лайк поставлен' });
    } catch (error) {
        if (error instanceof MongoodeError.CastError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Некорректные данные для постановки лайка',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};

export const dislikeCard = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const { cardId } = req.params;

        if (!cardId) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }

        await Card.findByIdAndUpdate(
            {
                _id: cardId,
                likes: { $in: [userId] },
            },
            { $pull: { likes: req.user._id } },
            { new: true },
        );
        return res.send({ message: 'Лайк снят' });
    } catch (error) {
        if (error instanceof MongoodeError.CastError) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
                message: 'Некорректные данные для снятия лайка',
            });
        }
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
    }
};
