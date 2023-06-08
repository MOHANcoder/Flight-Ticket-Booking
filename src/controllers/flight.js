const Flight = require("../models/Flight.js");
const User = require("../models/User.js");
const Ticket = require("../models/Ticket.js");

module.exports = {
  // Function to add a new flight to the database
  addFlight: async (req, res, next) => {
    const flight = new Flight(req.body);
    try {
      // Save the new flight to the database
      const savedFlight = await flight.save();
      res.status(200).json(savedFlight);
    } catch (err) {
      next(err);
    }
  },

  // Function to update an existing flight in the database
  updateFlight: async (req, res, next) => {
    try {
      // Find the flight by its ID and update it with the new data from the request body
      const updatedFlight = await Flight.findByIdAndUpdate(
        req.params.flightId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedFlight);
    } catch (err) {
      next(err);
    }
  },

  // Function to remove an existing flight from the database
  removeFlight: async (req, res, next) => {
    try {
      // Find the flight by its ID and delete it from the database
      await Flight.findByIdAndDelete(req.params.flightId);
      res.status(200).json("Flight has been deleted");
    } catch (err) {
      next(err);
    }
  },

  // Function to get all flights from the database
  getAllFlights: async (req, res, next) => {
    try {
      const { flightNumber, departureTime, departureDate, availability } = req.query;

      const conditions = {};

      // Check if flightNumber parameter is provided and add it to the query conditions
      if (flightNumber) {
        conditions.flightNumber = { $eq: flightNumber };
      }

      // Check if departureDate parameter is provided and add it to the query conditions
      if (departureDate) {
        conditions.departureDate = { $eq: new Date(departureDate) };
      }

      // Check if departureTime parameter is provided and add it to the query conditions
      if (departureTime) {
        conditions.departureTime = { $eq: departureTime };
      }

      // Check if availability parameter is provided and add it to the query conditions
      if (availability) {
        conditions.availableSeats = { $gte: availability };
      }

      // Find flights that match the query conditions
      const flights = await Flight.find(conditions);
      res.status(200).json(flights);
    } catch (err) {
      next(err);
    }
  },

  // Function to get a single flight by its ID
  getFlight: async (req, res, next) => {
    try {
      // Find the flight by its ID
      const flight = await Flight.findById(req.params.flightId);
      res.status(200).json(flight);
    } catch (error) {
      next(error);
    }
  },

  // Function to book a flight
  bookFlight: async (req, res, next) => {
    try {
      const { flightId } = req.body;

      // Find the flight by its ID
      const flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({ success: false, message: "Flight not found!" });
      }

      // Check if there are available seats on the flight
      if (flight.availableSeats == 0) {
        return res.status(400).json({ success: false, message: "No available seats on this flight!" });
      }

      // Calculate the seat number based on the flight's capacity and available seats
      let seatNumber = flight.capacity - flight.availableSeats;

      // Update the seat as booked for the user
      flight.seats[seatNumber] = { isBooked: true, userID: req.user.id };

      // Decrease the available seats count
      flight.availableSeats--;

      // Save the updated flight
      await flight.save();

      // Find the user by their ID
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Add the booked flight to the user's bookedFlights array
      user.bookedFlights.push(flight);

      // Create a new ticket for the booking
      const ticket = new Ticket({
        userId: req.user.id,
        flightId: flight._id,
        seat: seatNumber+1,
        passengerName: user.username,
        boardingDate: new Date(flight.departureDate),
        boardingTime: flight.departureTime
      });

      // Add the ticket to the user's tickets array
      user.tickets.push(ticket);

      // Save the ticket and user
      await ticket.save();
      await user.save();

      res.status(200).json({ success: true, message: "Flight booked" });
    } catch (error) {
      next(error);
    }
  }
};
