const mongoose = require('mongoose')

const baseOptions = {
    discriminatorKey: 'questionType',
    collection: 'questions'
}

const questionSchema = new mongoose.Schema({
    type: String,
    question: {type: String, required: true},
    marks: Number,
    allocatedTime: Number
}, baseOptions)

const questionModel = mongoose.model('Question', questionSchema)

const singleChoiceSchema = new mongoose.Schema({
    options: [String],
    correctAnswer: String
})

const singleChoiceModel = questionModel.discriminator('SingleChoiceQuestion', singleChoiceSchema)

const multiChoiceQuestionSchema = new mongoose.Schema({
    options: [String],
    correctAnswers: [String]
})

const multiChoiceModel = questionModel.discriminator('MultiChoiceQuestion', multiChoiceQuestionSchema)

const essaySchema = new mongoose.Schema({
    wordLimit: Number,
    answer: String
})

const essayModel = questionModel.discriminator("EssayQuestion", essaySchema)

module.exports = {
    questionModel,
    singleChoiceModel,
    multiChoiceModel,
    essayModel,
    questionSchema
}