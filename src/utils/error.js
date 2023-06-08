// Create and export a function for creating custom errors
const createError = (message, status) => {
    const err = new Error(); // Create a new Error object
    err.status = status; // Set the error status
    err.message = message; // Set the error message
    return err; // Return the created error object
};

module.exports = createError; // Export the createError function for use in other files
