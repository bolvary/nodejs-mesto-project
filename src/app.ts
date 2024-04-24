import 'dotenv/config';
import expess, {
  json, Request, Response, NextFunction 
} from 'express';
import mongoose from 'mongoose';
import router from './routes'

const { PORT = 3001, MONGO_URL = '' } = process.env;
const helmet = require('helmet');

const app = expess();

app.use(json());
app.use(helmet());

app.use((req: Request, res: Response, next: NextFunction) => {
    req.user = {
      _id: '6628ba8e96fc4045a9318231',
    };

    next();
});

app.use(router);

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
