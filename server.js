const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const recipeRoutes = require("./routes/recipes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ---------------- MONGODB CONNECTION ----------------

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_ATLAS_URI
      : process.env.MONGO_LOCAL_URI;

  if (!mongoURI) {
    throw new Error("MongoDB URI not defined");
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

// ensure DB connection for every request (Vercel safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// routes
app.use("/api/recipes", recipeRoutes);

// export for Vercel
module.exports = app;
