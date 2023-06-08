const router = require("express").Router(); // Import the Express router
const { verifyAdmin, verifyUser } = require("../utils/verifyToken.js"); // Import the verifyAdmin and verifyUser middleware functions for token verification
const {
    addFlight,
    removeFlight,
    getAllFlights,
    getFlight,
    updateFlight,
    bookFlight
} = require("../controllers/flight.js"); // Import the flight controller functions
 

router.post("/", verifyAdmin, addFlight); // Route for adding a new flight, accessible only to admins
router.delete("/:flightId", verifyAdmin, removeFlight); // Route for removing a flight, accessible only to admins
router.get("/:flightId", verifyUser, getFlight); // Route for getting a specific flight, accessible to authenticated users
router.get("/", verifyUser, getAllFlights); // Route for getting all flights, accessible to authenticated users
router.put("/:flightId", verifyAdmin, updateFlight); // Route for updating a flight, accessible only to admins
router.post("/book/", verifyUser, bookFlight); // Route for booking a flight, accessible to authenticated users

module.exports = router; // Export the router to be used in other files
