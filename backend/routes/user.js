// Login and signup routes
const express = require('express');
const bcrypt = require('bcrypt'); // npm install --save bcrypt
const jwt = require('jsonwebtoken'); // npm install --save jsonwebtoken

const router = express.Router();

const User = require('../models/user');
const users = [];

router.post("/signup", (request, response, next) => {
    bcrypt.hash (request.body.password, 10).then (hash => {
        const user = new User({
            email: request.body.email,
            password: hash
            // password: request.body.password // This is bad because we store password in clear
        });

        console.log (user);
        users.push (user);
        response.status (201).json({
            message: 'User created',
            result: user
        });

        // With MongoDB
        /* user.save ()
            .then (result => {
                response.status (201).json({
                    message: 'User created',
                    result: result
                });
            })
            .catch (err => {
                response.status (500).json({
                    error: err
                }); 
            }) */
    });
});

router.post ("/login", (request, response, next) => {
    let fetchedUser;

    const userToFind = users.find (user => user.email === request.body.email);
    if (!userToFind) {
        return response.status (401).json ({
            message: 'Auth failed'
        })
    } // if
    
    bcrypt.compare (request.body.password, userToFind.password).then (
        (result => {
            if (!result) {
                return response.status (401).json ({
                    message: 'Auth failed'
                })
            } // if
    
            // Learn more on jwt.io
            const token = jwt.sign ({ email: userToFind.email, userId: userToFind._id }, 'secret_this_should_be_longer', { expiresIn: "1h" }); // Create a new token
            response.status (200).json ({
                token: token,
                expiresIn: 3600
            });
        })
    );

    // With MongoDB
    /* User.findOne ({ email: request.body.email })
        .then (user => {
            if (!user) {
                return response.status (401).json ({
                    message: 'Auth failed'
                })
            } // if
            fetchedUser = user;
            return bcrypt.compare (request.body.password, user.password)
        })
    .then (result => {
        if (!result) {
            return response.status (401).json ({
                message: 'Auth failed'
            })
        } // if

        // Learn more on jwt.io
        const token = jwt.sign ({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_longer', { expiresIn: "1h" }); // Create a new token
        response.status (200).json ({
            token: token
        });
    })
    .catch (err => {
        return response.status (401).json ({
            message: 'Auth failed'
        })
    }) */
});

module.exports = router;