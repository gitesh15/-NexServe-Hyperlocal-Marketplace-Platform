const express = require("express");

const router = express.Router();

const otpGenerator = require("otp-generator");

const Otp = require("../models/Otp");

const sendEmail = require("../utils/sendEmail");

// SEND OTP

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await Otp.deleteMany({ email });

    await Otp.create({
      email,

      otp,

      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, otp);

    res.status(200).json({
      success: true,

      message: "OTP sent successfully",
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
