const express = require("express");

const router = express.Router();

const User = require("../models/User");

// ===================================
// UPDATE AVAILABILITY
// ===================================

router.put("/availability/:id", async (req, res) => {
  try {
    const { availability } = req.body;

    const updatedProvider = await User.findByIdAndUpdate(
      req.params.id,
      {
        availability,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      provider: updatedProvider,
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
