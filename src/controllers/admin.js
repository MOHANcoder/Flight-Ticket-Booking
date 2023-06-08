const Admin = require("../models/Admin.js");   //Importing the Admin model
const bcrypt = require("bcryptjs"); //bcryptjs library, which is used for hashing and comparing passwords.
const createError = require("../utils/error.js"); //importing createError utility function
const jwt = require("jsonwebtoken");    //Importing jwt to generate an access token for the admin user upon successful login.
const Flight = require("../models/Flight.js"); //Importing the Flight model

module.exports = {
    // Register a new admin
    register: async (req, res, next) => {
        try {
            const salt = bcrypt.genSaltSync(10);    //generating a salt value for the password hashing process.
            const hash = bcrypt.hashSync(req.body.password, salt);
            // Create a new admin instance with hashed password
            const admin = new Admin({
                ...req.body,
                password: hash
            });
            // Save the admin to the database
            await admin.save();
            res.status(200).send("New admin created successfully.");
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            // Find the admin by username
            const admin = await Admin.findOne({
                username: req.body.username
            });
            if (!admin)
                return next(createError(404, "admin not found!"));
            // Compare the provided password with the hashed password
            const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);

            if (!isPasswordCorrect)
                return next(createError(400, "Wrong password or adminname."));
            // Generate an access token with admin ID and role
            const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT);
            const { password, ...others } = admin._doc;
            // Set the access token as a cookie and send the admin data
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json({ ...others });
        } catch (err) {
            next(err);
        }
    },
    logout: (req, res, next) => {
        res.clearCookie("token");
        res.json({ message: "Logged out successfully" });
    },
    getAllBookings: async (req, res, next) => {
        try {
            const { flightNumber, departureTime,departureDate } = req.query;
            console.log(flightNumber,departureTime,departureDate);
            // Set the conditions based on the provided query parameters
            const conditions = {};
            if (flightNumber)
                conditions.flightNumber = {$eq : flightNumber};
                
            if (departureDate) {
                conditions.departureDate = {$eq:new Date(departureDate)};
            }
            if (departureTime) {
                conditions.departureTime = {$eq:departureTime};
            }
             // Find flights based on the conditions
            const flights = await Flight.find(conditions);
            const bookings = [];
            flights.forEach(flight => {
                const users = [];
                // Iterate over the seats of each flight and collect booked users
                flight.seats.forEach((seat, seatNumber) => {
                    if (seat.isBooked) {
                        users.push({ seatNumber, userID: seat.userID });
                    }
                });
                // Add flight details and booked users to bookings array
                bookings.push({
                    flightNumber: flight.flightNumber,
                    airline: flight.airline,
                    bookedUsers: users
                });
            })
            res.status(200).json(bookings);
        } catch (err) {
            next(err);
        }

    }
}
