const express = require("express");

const router = express.Router();

const User = require("../models/User");

// ============================
// GET ALL PROVIDERS
// ============================

router.get("/", async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
    }).select("-password");

    res.status(200).json({
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

// ============================
// SEARCH PROVIDERS
// ============================

router.get("/search/:service", async (req, res) => {
  try {
    const service = req.params.service;

    const providers = await User.find({
      role: "provider",

      service: {
        $regex: service,
        $options: "i",
      },
    }).select("-password");

    res.status(200).json({
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

// ============================
// UPDATE AVAILABILITY
// ============================

router.put("/availability/:id", async (req, res) => {
  try {
    const { availability } = req.body;

    const provider = await User.findByIdAndUpdate(
      req.params.id,
      {
        availability,
      },
      {
        new: true,
      },
    ).select("-password");

    res.status(200).json({
      success: true,
      provider,
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
