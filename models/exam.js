const mongoose = require('mongoose')
const {questionSchema} = require('./Question')

const examSchema = new mongoose.Schema({
    examDetails: String,
    eDate: Date,
    eTime: String,
    duration: Number,
    question: [questionSchema]
})

const examModel = mongoose.model('Exam', examSchema)
module.exports = examModel