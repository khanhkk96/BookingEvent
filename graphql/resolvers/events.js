const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        const events = await Event.find();
        return events.map(async (item) => {
            return transformEvent(item);
        });
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }

        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                creator: '62610195c2112c206b56aae8',
            });
            const rs = await event.save();

            const userInfo = await User.findById('62610195c2112c206b56aae8');
            if (userInfo) {
                userInfo.createdEvents.push(event);
                await userInfo.save();
            } else {
                throw new Error('User is not found.');
            }

            return transformEvent(rs);
        } catch (err) {
            console.log(err);
            return null;
        }
    },
};
