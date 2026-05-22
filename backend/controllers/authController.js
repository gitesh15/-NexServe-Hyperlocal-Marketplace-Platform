const User = require("../models/User");

const bcrypt = require("bcryptjs");

// ============================
// REGISTER USER
// ============================

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, service, location, experience } =
      req.body;

    // CHECK EXISTING USER

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,

      // PROVIDER DATA
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

// ============================
// LOGIN USER
// ============================

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // FIND USER

    const user = await User.findOne({ email });

    // USER NOT FOUND

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup first",
      });
    }

    // CHECK ROLE

    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: `This account is registered as ${user.role}`,
      });
    }

    // CHECK PASSWORD

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
