const Booking = require("../models/Booking");

// CREATE BOOKING

const createBooking = async (req, res) => {
  try {
    const { customerName, service, address } = req.body;

    const booking = await Booking.create({
      customerName,
      service,
      address,
      phone,
    });

    res.status(201).json({
      success: true,

      booking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET BOOKINGS

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ACCEPT BOOKING

const acceptBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,

      {
        status: "accepted",
      },

      {
        new: true,
      },
    );

    res.status(200).json({
      success: true,

      booking: updatedBooking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  createBooking,
  getBookings,
  acceptBooking,
};
