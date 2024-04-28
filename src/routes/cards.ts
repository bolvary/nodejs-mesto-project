import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';

import { linkPattern } from '../contants';
import {
    createCard, deleteCardById, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required().pattern(linkPattern),
    }),
}), createCard);
cardRouter.delete('/:cardId', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required().hex().length(24),
      }),
}), deleteCardById);
cardRouter.put('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required().hex().length(24),
      }),
}), likeCard);
cardRouter.delete('/:cardId/likes', celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().required().hex().length(24),
      }),
}), dislikeCard);

export default cardRouter;
