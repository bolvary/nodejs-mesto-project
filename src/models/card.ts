import mongoose, { model, Schema } from 'mongoose';

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
            default: Date.now(),
        },
    },
    {
        versionKey: false,
    },
);

export default model('card', cardSchema);
