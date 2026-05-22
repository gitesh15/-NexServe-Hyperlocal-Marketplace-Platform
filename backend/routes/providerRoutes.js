const express = require("express");

const router = express.Router();

const User = require("../models/User");

// SEARCH PROVIDERS

router.get("/search/:service", async (req, res) => {
  try {
    const service = req.params.service;

    const providers = await User.find({
      role: "provider",

      service: {
        $regex: service,
        $options: "i",
      },
    });

    res.json({
      success: true,
      providers,
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
