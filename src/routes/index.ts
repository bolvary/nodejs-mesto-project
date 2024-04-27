import { Router } from 'express';
import { NotFoundError } from '../helpers/errors';
import { constants } from 'http2';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.all('*', (req, res) => {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
});

export default router;
