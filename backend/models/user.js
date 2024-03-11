const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator'); // npm install --save mongoose-unique-validator
const userSchema = mongoose.Schema ({
    email: { type: String, required: true, unique: true }, // unique is not a validator, unlike required; unique allows Mongoose to do some internal optimizations
    password: { type: String, required: true },
});

userSchema.plugin (uniqueValidator); // This will validate the userSchema

module.exports = mongoose.model ('User', userSchema);