// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isInstructor: { type:Boolean, required: true},
});

const User = mongoose.model('UserNew', UserSchema);
module.exports = User;
