const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const createError = require("./error.js"); // Import the custom error creation function

// Middleware function for verifying token
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; // Get the token from the access_token cookie in the request
    if (!token) {
        return next(createError(401, "You are not authenticated")); // If no token is found, create and pass an authentication error to the next middleware
    }

    jwt.verify(token, process.env.JWT, (err, user) => { // Verify the token using the secret key stored in process.env.JWT
        if (err)
            return next(createError(403, "Token is not valid!")); // If the token is not valid, create and pass an authorization error to the next middleware
        req.user = user; // Attach the user object extracted from the token to the request object
        next(); // Call the next middleware
    });
};

module.exports = {
    verifyToken, // Export the verifyToken middleware function
    verifyUser: (req, res, next) => { // Middleware function for verifying user role
        verifyToken(req, res, () => {
            if (req.user.role === "user") { // If the role is "user", proceed to the next middleware
                next();
            } else {
                return next(createError(403, "You are not authorized!")); // If the user is not authorized, create and pass an authorization error to the next middleware
            }
        })
    },
    verifyAdmin: (req, res, next) => { // Middleware function for verifying admin role
        verifyToken(req, res, () => {
            if (req.user.role === "admin") { // If the role is "admin", proceed to the next middleware
                next();
            } else {
                return next(createError(403, "You are not authorized!")); // If the user is not authorized, create and pass an authorization error to the next middleware
            }
        })
    }
};
