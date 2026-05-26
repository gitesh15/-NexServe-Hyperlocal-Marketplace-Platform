const User = require("../models/User");

const bcrypt = require("bcryptjs");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      role,
      service,
      location,
      experience,
    } = req.body;

    // VALIDATION

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // EMAIL VALIDATION

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // MOBILE VALIDATION

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    // PASSWORD LENGTH

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // CHECK EXISTING USER

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile already registered",
      });
    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role,

      service: role === "provider" ? service : "",
      location: role === "provider" ? location : "",
      experience: role === "provider" ? experience : "",
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ROLE CHECK

    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `This account is registered as ${user.role}`,
      });
    }

    // PASSWORD CHECK

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
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
  registerUser,
  loginUser,
};
