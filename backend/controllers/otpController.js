const otpGenerator = require("otp-generator");

const Otp = require("../models/Otp");

const sendEmail = require("../utils/sendEmail");

exports.sendOtp = async (req, res) => {
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

      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({ email, otp });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,

        message: "Invalid OTP",
      });
    }

    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,

        message: "OTP Expired",
      });
    }

    res.status(200).json({
      success: true,

      message: "OTP Verified",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server Error",
    });
  }
};
