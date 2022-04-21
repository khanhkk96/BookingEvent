const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((item) => {
        return transformBooking(item);
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new Error("Event is not found");
    }
    const booking = new Booking({
      user: "62610195c2112c206b56aae8",
      event: fetchedEvent,
    });

    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args) => {
    const booking = await Booking.findById(args.bookingId).populate("event");
    if (booking) {
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } else {
      throw new Error("Event is not found.");
    }
  },
};
