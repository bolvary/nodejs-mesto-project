import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const { isEmail } = require('validator');

export interface IUser {
    name: string,
    about: string,
    email: string,
    password: string,
    avatar: string,
}

interface UserModel extends mongoose.Model<IUser> {
    findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
  }

const userSchema = new Schema<IUser, UserModel>(
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
                validator: function(email: string) {
                  return isEmail(email);
                },
                message: props => `${props.value} is not a valid email!`
              }
        },

        password: {
            type: String,
            required: true,
        },

        about: {
            type: String,
            minlenght: 2,
            maxlenght: 200,
            default: 'Исследователь',
        },

        avatar: {
            type: String,
            default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        },
    },
    {
        versionKey: false,
    },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
        .then((user) => {
        if (!user) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password)
            .then((matched: boolean) => {
            if (!matched) {
                return Promise.reject(new Error('Неправильные почта или пароль'));
            }

            return user;
            });
        });
});

export default model('user', userSchema);
