const mongoose = require('mongoose')


const resultSchema = new mongoose.Schema({
    examId: String,
    registrationNo: String,
    answers: Object
})

const resultModel = mongoose.model('Result', resultSchema)
module.exports = resultModel