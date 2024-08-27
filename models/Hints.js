const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
    errorType: String, 
    hintText: String, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
const Hint = mongoose.model('Hint', hintSchema);
module.exports = Hint;