const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const voteRoutes = require("./routes/vote");

const app = express();

// ====================
// Middlewares
// ====================
app.use(express.json());
app.use(cors());

// ====================
// Routes
// ====================
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Voting API Running Securely 🚀");
});

// ====================
// MongoDB Connection
// ====================
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
})
.catch(err => console.log("DB Connection Error:", err));