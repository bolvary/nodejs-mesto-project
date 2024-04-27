import mongoose, { model, Schema, Document } from 'mongoose';
import { compare } from 'bcryptjs';
import validator from 'validator';
import { AutorizationError } from '../helpers/errors';

const { isEmail } = require('validator');

export interface IUser extends Document {
    name: string,
    about: string,
    email: string,
    password: string,
    avatar: string,
}

interface IUserModel extends mongoose.Model<IUser> {
    findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

export const userSchema: Schema = new Schema<IUser>(
    {
        name: {
            type: String,
            minlenght: 2,
            maxlenght: 30,
            default: 'Жак-Ив Кусто',
        },

        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (email: string) => isEmail(email),
                message: (props) => `${props.value} невалидный формат email`,
            },
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        about: {
            type: String,
            minlenght: 2,
            maxlenght: 200,
            default: 'Исследователь',
        },

        avatar: {
            type: String,
            validate: {
                validator: (value: string) => validator.isURL(value, {
                    protocols: ['http', 'https'],
                    require_tld: true,
                    require_protocol: true,
                }),
                message: 'Невалидный урл аватарки',
            },
            default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        },
    },
    {
        versionKey: false,
    },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).select('+password')
        .then((user: IUser) => {
            if (!user) {
                throw new AutorizationError();
            }

            return compare(password, user.password)
                .then((matched: boolean) => {
                    if (!matched) {
                        throw new AutorizationError();
                    }
                    return user;
                });
        });
});

export const user: IUserModel = model<IUser, IUserModel>('user', userSchema);

export default user;
