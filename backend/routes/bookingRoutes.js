const express = require("express");

const router = express.Router();

const Booking = require("../models/Booking");

// ============================
// CREATE BOOKING
// ============================

router.post("/create", async (req, res) => {
  try {
    const {
      customerId,
      providerId,
      customerName,
      providerName,
      service,
      address,
      date,
      time,
      description,
    } = req.body;

    const newBooking = new Booking({
      customerId,
      providerId,
      customerName,
      providerName,
      service,
      address,
      date,
      time,
      description,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking Created",
      booking: newBooking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
// ============================
// ACCEPT BOOKING
// ============================

router.put("/accept/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        status: "accepted",

        acceptedAt: new Date(),
      },
      { new: true },
    );

    res.status(200).json({
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
});
// ============================
// CUSTOMER BOOKINGS
// ============================

router.get("/customer/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.params.id,
    }).sort({
      createdAt: -1,
    });

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
});

// ============================
// PROVIDER BOOKINGS
// ============================

router.get("/provider/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      providerId: req.params.id,
    }).sort({
      createdAt: -1,
    });

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
});

// ============================
// UPDATE STATUS
// ============================

router.put("/status/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true },
    );

    res.status(200).json({
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
});

module.exports = router;
