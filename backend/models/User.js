const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["customer", "provider"],
    default: "customer",
  },

  // PROVIDER DATA

  service: {
    type: String,
  },

  location: {
    type: String,
  },

  experience: {
    type: String,
  },

  rating: {
    type: Number,
    default: 4.8,
  },
});

module.exports = mongoose.model("User", userSchema);
