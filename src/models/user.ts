import { model, Schema } from 'mongoose';

interface IUser {
    name: string,
    about: string,
    avatar: string,
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            minlenght: 2,
            maxlenght: 30,
        },

        about: {
            type: String,
            required: true,
            minlenght: 2,
            maxlenght: 200,
        },

        avatar: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    },
);

export default model('user', userSchema);
