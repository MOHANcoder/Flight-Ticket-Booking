const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const createError = require("../utils/error.js");
const jwt = require("jsonwebtoken");

module.exports = {
  // Function to register a new user
  register: async (req, res, next) => {
    try {
      // Generate a salt and hash the password
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);

      // Create a new user with the provided data and hashed password
      const user = new User({
        ...req.body,
        password: hash
      });

      // Save the new user to the database
      await user.save();
      res.status(200).send("New User created successfully.");
    } catch (err) {
      next(err);
    }
  },

  // Function to handle user login
  login: async (req, res, next) => {
    try {
      // Find the user by their username
      const user = await User.findOne({
        username: req.body.username
      });

      // If user is not found, return an error
      if (!user) {
        return next(createError(404, "User not found!"));
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

      // If the passwords don't match, return an error
      if (!isPasswordCorrect) {
        return next(createError(400, "Wrong password or username."));
      }

      // Generate a JSON Web Token (JWT) for the user
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);

      // Remove the password field from the user object
      const { password, ...others } = user._doc;

      // Set the access_token cookie with the JWT and send the user object in the response
      res.cookie("access_token", token, {
        httpOnly: true
      }).status(200).json({ ...others });
    } catch (err) {
      next(err);
    }
  },

  // Function to handle user logout
  logout: (req, res, next) => {
    // Clear the access_token cookie and send a success message
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  },

  // Function to get the bookings of the authenticated user
  myBookings: async (req, res, next) => {
    try {
      // Find the user by their ID and return their bookedFlights array
      const user = await User.findById(req.user.id);
      res.status(200).json(user.bookedFlights);
    } catch (error) {
      next(error);
    }
  }
};
