const express = require("express"); // Import the Express framework
const { register, login, logout, myBookings } = require("../controllers/user.js"); // Import the user controller functions
const { verifyUser } = require("../utils/verifyToken.js"); // Import the verifyUser middleware function for token verification
const router = express.Router(); // Create an instance of Express router

router.post("/signup", register); // Route for user registration
router.post("/login", login); // Route for user login
router.post("/logout", logout); // Route for user logout
router.get("/mybookings", verifyUser, myBookings); // Route for retrieving user's bookings, accessible to authenticated users

module.exports = router; // Export the router to be used in other files
