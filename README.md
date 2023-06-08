
# Flight Ticket Booking API Documentation
This documentation provides an overview of the Flight Booking System API. The API allows users to sign up , login, book flights, and perform various operations related to flights and bookings.


## Author

- [@Mohan](https://www.github.com/Tringapps-Mohan)


## Table of content

- Introduction
- API Endpoints
    - Authentication.
    - User.
    - Admin.
    - Flight.

- Models
    - User Model
    - Admin Model
    - Flight Model
    - Ticket Model
- Error Handling
- Authentication and Authorization
## Introduction

The Flight Booking System API allows users to perform various operations related to flight booking, such as registering as a user, logging in, booking flights, managing bookings, and more. The API is designed to provide a seamless experience for users and administrators.

To use the API, clients need to send HTTP requests to the specified endpoints with the required parameters and data. The API will process the requests and return the appropriate responses.

## API Endpoints

### Authentication
-     POST /users/signup 
    Register a new user.

-     POST /users/login 
    Log in as a user and obtain an access token.

-     POST /users/logout 
    Log out the currently authenticated user.

### User
-       GET /users/bookings 

    Get the bookings of the authenticated user.

### Admin
-       POST /admin/signup 
    Register a new admin.

-       POST /admin/login
    Log in as an admin and obtain an access token.

-       POST /admin/logout 
    Log out the currently authenticated admin.

-       GET /admin/bookings
    Get all flight bookings based on filters (flight number, departure time, departure date).

### Flight
-       POST /flights/
    Add a new flight.

-       PUT /flights/:flightId
    Update an existing flight.

-       DELETE /flights/:flightId
    Remove a flight.

-       GET /flights/ 
    Get all flights based on filters (flight number, departure time, departure date, availability).

-       GET /flights/:flightId
    Get detailed information about a specific flight.

-       POST /flights/book
    Book a flight.

    
## Models
### User model
The User model represents a user in the Flight Booking System. It contains the following fields:

-   username: User's username (String, required, unique).

-   email: User's email address (String, required, unique, validated using regular expression).

-   password: User's password (String, required, hashed using bcrypt).

-   phone: User's phone number (String, required, validated to be 10 characters long).

-   dob: User's date of birth (Date).

-   img: User's profile image (String).

-   address: User's address (Embedded document with fields: country, state, city, street, postalCode).

-   bookedFlights: Array of flight references representing the flights booked by the user.

-   role: User's role (String, default: "user").

-   tickets: Array of ticket references representing the tickets booked by the user.
### Admin Model

The Admin model represents an administrator in the Flight Booking System. It contains the following fields:

-   username: Admin's username (String, required, unique).

-   email: Admin's email address (String, required, unique, validated using regular expression).

-   password: Admin's password (String, required, hashed using bcrypt).

-   phone: Admin's phone number (String, required, validated to be 10 characters long).

-   role: Admin's role (String, default: "admin").

### Flight Model

The Flight model represents a flight in the Flight Booking System. It contains the following fields:

-   flightNumber: Flight number (String, required, unique).

-   airline: Airline name (String).

-   departureDate: Date of departure (Date).

-   departureTime: Time of departure (String).

-   arrivalDate: Date of arrival (Date).

-   arrivalTime: Time of arrival (String).

-   source: Source airport (String).

-   destination: Destination airport (String).

-   capacity: Total capacity of the flight (Number).

-   availableSeats: Number of available seats on the flight (Number).

-   seats: Array of seat objects representing the seats on the flight. Each seat object contains the seat number, booking status, and user ID (if booked).

### Ticket Model

The Ticket model represents a flight ticket in the Flight Booking System. It contains the following fields:

-   userId: ID of the user who booked the ticket (reference to the User model).

-   flightId: ID of the flight for which the ticket is booked (reference to the Flight model).

-   seat: Seat number of the booked ticket (Number).

-   passengerName: Name of the passenger (String).

-   boardingDate: Date of boarding (Date).

-   boardingTime: Time of boarding (String).
## Error Handling

The API handles errors using the "createError" utility function. Each endpoint checks for specific conditions and throws an error with an appropriate status code and message. The errors are then handled by the error handling middleware.

##  Authentication and Authorization

The API uses "JSON Web Tokens (JWT)" for user authentication and authorization. When a user or admin logs in, an access token is generated and returned in the response. This token needs to be included in the Authorization header of subsequent requests to authenticate and authorize the user or admin.

All routes except for the authentication routes (/signup and /login) require a valid access token to be included in the request headers. If an invalid or expired token is provided, the API will return a 401 Unauthorized error.
