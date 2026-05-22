const User = require("../models/User");

// GET ALL PROVIDERS

const getProviders = async (req, res) => {
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
};

module.exports = {
  getProviders,
};
