// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");
const flightRoute = require("./routes/flightRoutes.js");
const cookieParser = require("cookie-parser");

// Create an instance of the Express application
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for parsing JSON request bodies
app.use(express.json());

// Define routes for different endpoints
app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use("/flights", flightRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

// Event listener for MongoDB disconnection
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

// Start the server
app.listen(1000, () => {
    // Connect to MongoDB when the server starts
    connect();
    console.log("Server started.");
});
