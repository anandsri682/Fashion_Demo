const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Node.js server is working",
  });
});

// Test MongoDB route
app.get("/test-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    res.json({
      success: true,
      message: "MongoDB Atlas connection is working",
      database: mongoose.connection.name,
      collections: collections.map((collection) => collection.name),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database test failed",
      error: error.message,
    });
  }
});