import { Router } from 'express';
import { constants } from 'http2';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.all('*', (req, res) => {
    res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

export default router;
