const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  acceptBooking,
} = require("../controllers/bookingController");
// CREATE

router.post("/create", createBooking);

// GET

router.get("/all", getBookings);
router.put("/accept/:id", acceptBooking);

module.exports = router;
