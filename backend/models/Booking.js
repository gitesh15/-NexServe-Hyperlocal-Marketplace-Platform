const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  service: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
