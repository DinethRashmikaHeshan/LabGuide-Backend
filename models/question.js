const mongoose = require('mongoose')

const baseOptions = {
    discriminatorKey: 'questionType',
    collection: 'questions'
}

const questionSchema = new mongoose({
    question: {type: String, required: true},
    marks: Number,
    allocatedTime: Number
}, baseOptions)

const questionModel = mongoose.model('Question', questionSchema)

const singleChoiceSchema = new mongoose({
    options: [String],
    correctAnswer: String
})

const singleChoiceModel = questionSchema.discriminator('SingleChoiceQuestion', singleChoiceSchema)

const multiChoiceQuestionSchema = new mongoose({
    options: [String],
    correctAnswers: [String]
})

const multiChoiceModel = questionSchema.discriminator('MultiChoiceQuestion', multiChoiceQuestionSchema)

const essaySchema = new mongoose({
    wordLimit: Number
})

const essayModel = questionSchema.discriminator("EssayQuestion", essaySchema)

module.exports = {
    questionModel,
    singleChoiceModel,
    multiChoiceModel,
    essayModel
}