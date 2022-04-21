const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const singleEvent = async (eventId) => {
    const event = await Event.findById(eventId);
    return transformEvent(event);
};

const user = async (userId) => {
    const userInfo = await User.findById(userId);
    return {
        ...userInfo._doc,
        createdEvents: events.bind(this, userInfo._doc.createdEvents),
    };
};

const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator),
    };
};

const events = async (eventIds) => {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map(async (event) => {
        return transformEvent(event);
    });
    return events;
};

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
