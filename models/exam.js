const mongoose = require('mongoose')
const question = import('./question')

const examSchema = new mongoose({
    examDetails: String,
    date: date,
    time: time,
    duration: Number,
    question: question
})

const examModel = mongoose.model('Exam', examSchema)
module.exports = examModel