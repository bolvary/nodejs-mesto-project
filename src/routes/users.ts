import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';

import { linkPattern } from '../contants';
import {
    getMyProfile,
    getUserById, getUsers, updateMyAvatar, updateMyProfile,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getMyProfile);
userRouter.get('/:userId', getUserById);

userRouter.patch('/me', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
    }),
}), updateMyProfile);

userRouter.patch('/me/avatar', celebrate({
    body: Joi.object().keys({
        avatar: Joi.string().required().pattern(linkPattern),
    }),
}), updateMyAvatar);

export default userRouter;
