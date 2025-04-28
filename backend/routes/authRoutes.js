const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model
require("dotenv").config(); // For environment variables like JWT secret

const router = express.Router();

// Registration route (POST /register)
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email or username already exists in the database
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route (POST /login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Set the token expiration time

    res.status(200).json({ token , "id" : user._id}); // Send the token to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
