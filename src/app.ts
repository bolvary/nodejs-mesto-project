import expess, { json } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import { errors as celebrateErrors, celebrate, Joi } from 'celebrate';

import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import handleErrors from './middlewares/handleErrors';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes'
import { linkPattern } from './contants';

const { PORT = 3001, MONGO_URL = '' } = process.env;
const helmet = require('helmet');
const app = expess();

app.use(json());
app.use(helmet());

app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().required().pattern(linkPattern)
    })
}), createUser); 

app.use(auth);

app.use(router);
app.use(errorLogger);
app.use(celebrateErrors());
app.use(handleErrors);

const connect = async () => {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(MONGO_URL);
      await app.listen(PORT);
      console.log('Сервер запущен на порту', PORT);
    }
    catch(err) {
      console.log(err);
    }
}

connect();
