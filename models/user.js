const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creating schema for user profiles
const userSchema = new Schema({
    membershipId: { type: String, unique: true },
    token: { type: String },
    displayName: { type: String },
    profilePicture: { type: String },
    platforms: []
});

module.exports = mongoose.model('User', userSchema);
