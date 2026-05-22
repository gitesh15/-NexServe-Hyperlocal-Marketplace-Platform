const express = require("express");

const dotenv = require("dotenv");

const cors = require("cors");

const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");

const providerRoutes = require("./routes/providerRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/bookings", bookingRoutes);

app.use("/api/providers", providerRoutes);

// app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
