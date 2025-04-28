const jwt = require("jsonwebtoken");
require("dotenv").config(); // For JWT_SECRET from the environment variables
// Middleware to verify JWT token
const verifyJwt = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1]; // Extract token after "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload to the request object (so the next middleware or route can use it)
    req.user = decoded;
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyJwt;
