// This file will hold Express
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Connect to MongoDB
const app = express(); // Return an express app
const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

/* app.use ((request, response, next) => {
    console.log ("First middleware");
    next (); // The request will continue its journey
}); */

/* mongoose
    .connect("") // url to connect to MongoDB
    .then (() => {
        console.log ("Connected to database!");
    })
    .catch (() => {
        console.log ("Connection failed!");
    }); */

app.use(bodyParser.json()); // Parse json data
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images"))); // any request targeting /images will be allowed to continue

app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // Every domain is allowed to access our resources
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, FETCH, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
