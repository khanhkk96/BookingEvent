const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        createdEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
    },
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
