const express = require("express"); // Import the Express framework
const { register, login, logout, getAllBookings } = require("../controllers/admin.js"); // Import the admin controllers
const router = express.Router(); // Create an instance of Express router

// Define the routes and associate them with the corresponding controller functions
router.post("/signup", register); // Route for registering a new admin
router.post("/login", login); // Route for admin login
router.post("/logout", logout); // Route for admin logout
router.get("/bookings", getAllBookings); // Route for getting all bookings made by users

module.exports = router; // Export the router to be used in other files
