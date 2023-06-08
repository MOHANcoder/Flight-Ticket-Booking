const mongoose = require("mongoose");

// Define the Address schema
const AddressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
});

// Define the User schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return value.length === 10;
            },
            message: "Phone number must be exactly 10 characters long."
        }
    },
    dob: {
        type: Date,
        required: false,
    },
    img: {
        type: String,
    },
    address: {
        type: AddressSchema,
        required: false,
    },
    bookedFlights: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }],
        default: []
    },
    role: {
        type: String,
        default: "user"
    },
    tickets: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        }],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema); // Export the User model
