const mongoose = require("mongoose");

// Define the Flight schema
const FlightSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        unique: true
    },
    airline: {
        type: String,
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    availableSeats: {
        type: Number,
        default: 60,
        required: true
    },
    capacity: {
        type: Number,
        default: 60,
        required: true,
        min: 60
    },
    seats: {
        type: [Object],
        default: []
    },
    
    fare:{
        type:Number,
        required:true
    }
});

// Pre-save middleware function to initialize seats array
FlightSchema.pre("save", function(next) {
    if (this.isNew) {
        for (let seat = 0; seat < this.capacity; seat++) {
            this.seats[seat] = { isBooked: false, userID: "" };
        }
    }
    next();
});

module.exports = mongoose.model("Flight", FlightSchema);
