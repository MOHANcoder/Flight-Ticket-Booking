const mongoose = require("mongoose"); // Import the Mongoose library

// Define the Address schema for the admin's address
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

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
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
            message: "Phone number must be exactly 10 characters long.",
        },
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
    role: {
        type: String,
        default: "admin",
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Admin", AdminSchema); // Export the Admin model
