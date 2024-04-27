import { Response, Request, NextFunction } from 'express';
import { constants } from 'http2';

import { AccessDenided, NotFoundError } from '../helpers/errors';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cards = await Card.find({});
        return res.status(constants.HTTP_STATUS_OK).send(cards);
    } catch (error) {
        return next(error);
    }
};

export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cardId } = req.params;
        const userId = req.user._id;
        const removeCard = await Card.findOne({ _id: cardId, owner: userId });

        if (!removeCard) {
            throw new AccessDenided('Нельзя удалить карточку, которая не принадлежит пользователю');
        }
        await removeCard.deleteOne();
        return res.send({ message: 'Карточка удалена' });
    } catch (error) {
        return next(error);
    }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.owner = req.user._id;
        const newCard = await Card.create(req.body);
        return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
    } catch (error) {
        return next(error);
    }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const { cardId } = req.params;

        const card = await Card.findByIdAndUpdate(
            {
                _id: cardId,
                likes: { $nin: [userId] },
            },
            { $addToSet: { likes: userId } },
            { new: true },
        );
        if (!card) {
            throw new NotFoundError('Карточки не существует или она была удалена');
        }
        return res.send({ message: 'Лайк поставлен' });
    } catch (error) {
        return next(error);
    }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const { cardId } = req.params;

        if (!cardId) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        }

        const card = await Card.findByIdAndUpdate(
            {
                _id: cardId,
                likes: { $in: [userId] },
            },
            { $pull: { likes: req.user._id } },
            { new: true },
        );
        if (!card) {
            throw new NotFoundError('Карточки не существует или она была удалена');
        }
        return res.send({ message: 'Лайк снят' });
    } catch (error) {
        return next(error);
    }
};
