import { Router } from 'express';
import {
    createUser, getUserById, getUsers, updateMyAvatar, updateMyProfile,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);

userRouter.patch('/me', updateMyProfile);
userRouter.patch('/me/avatar', updateMyAvatar);

export default userRouter;
