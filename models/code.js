const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  language: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  username: { type: String },

  submissionDate: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

module.exports = mongoose.model("Code", CodeSchema);
