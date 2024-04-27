import mongoose, { model, Schema } from 'mongoose';
import validator from 'validator';

interface ICards {
    name: string,
    link: string,
    owner: mongoose.Schema.Types.ObjectId,
    likes: mongoose.Schema.Types.ObjectId[],
    createdAt: Date,
}

const cardSchema = new Schema<ICards>(
    {
        name: {
            type: String,
            required: true,
            minlenght: 2,
            maxlenght: 30,
        },
        link: {
            type: String,
            validate: {
                validator: (value: string) => validator.isURL(value, {
                    protocols: ['http', 'https'],
                    require_tld: true,
                    require_protocol: true,
                }),
                message: 'Невалидный урл аватарки',
            },
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        likes: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    },
);

export default model('card', cardSchema);
