const jwt = require ("jsonwebtoken");

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(" ")[1]; // Bearer [token]
        jwt.verify (token, "secret_this_should_be_longer"); // The same used to create the token in user.js
        next();
    } catch (error) {
        response.status (401).json({ message: "Auth failed!"});
    } // try - catch
};