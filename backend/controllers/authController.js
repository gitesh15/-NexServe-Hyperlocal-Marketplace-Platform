const User = require("../models/User");

const bcrypt = require("bcryptjs");

// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // CHECK USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
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
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please signup first.",
      });
    }

    // ROLE CHECK
    if (user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as ${user.role}`,
      });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // SUCCESS
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// EXPORTS
module.exports = {
  registerUser,
  loginUser,
};
