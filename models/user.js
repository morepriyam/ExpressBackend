// Import Mongoose library for database modeling
const mongoose = require("mongoose");

// Define the user schema with email and password fields
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
); // Enable automatic timestamps for createdAt and updatedAt

// Export the mongoose model for the "User" collection
module.exports = mongoose.model("User", userSchema);
