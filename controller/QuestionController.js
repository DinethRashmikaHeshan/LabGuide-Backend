const { singleChoiceModel, multiChoiceModel, essayModel, questionModel } = require('../models/Question')
const mongoose = require('mongoose')
const examModel = require('../models/exam')



class QuestionController {

    static async createQuestion(req) {
        try {
            const { type, question, marks, time, options, correctAnswer, correctAnswers, wordLimit } = req.body
            let Question = {}
            const single = "single"
            const multi = "multi"
            const essay = "essay"

            if (type === 'SingleChoice') {
                Question = new singleChoiceModel({
                    type: single,
                    question,
                    marks,
                    time,
                    options,
                    correctAnswer
                })
            } else if (type === 'MultipleChoice') {
                Question = new multiChoiceModel({
                    multi,
                    question,
                    marks,
                    time,
                    options,
                    correctAnswers
                })
            } else if (type === 'Essay') {
                Question = new essayModel({
                    essay,
                    question,
                    marks,
                    time,
                    wordLimit
                })
            }
            await Question.save()
            // res.status(201).json(Question)
            return Question
        } catch (error) {
            // res.status(500).json({message: error.message})
        }
    }

    static async getQuestion(req, res) {
        try {
            const { type } = req.body
            let question = []

            if (type == 'single') {
                question = await singleChoiceModel.find({
                    type: type
                })
            } else if (type == 'multi') {
                question = await multiChoiceModel.find({
                    type: type
                })
            } else if (type == 'essay') {
                question = await essayModel.find({
                    type: type
                })
            }

            res.status(200).json({ question })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    static async updateQuestion(req, res) {
        try {
            const  data  = req.body
            const { examID, quesID } = req.params

            // Create an empty object to hold the fields that need to be updated
            const updateFields = {};

            // Dynamically add fields to the update object based on what is provided
            if (data.question) updateFields["question.$.question"] = data.question;
            if (data.marks) updateFields["question.$.marks"] = data.marks;
            if (data.allocatedTime) updateFields["question.$.allocatedTime"] = data.allocatedTime;
            if (data.options) updateFields["question.$.options"] = data.options;
            if (data.correctAnswer) updateFields["question.$.correctAnswer"] = data.correctAnswer;
            if (data.correctAnswers) updateFields["question.$.correctAnswers"] = data.correctAnswers;
            if (data.wordLimit) updateFields["question.$.wordLimit"] = data.wordLimit;

            console.log('examID:', examID);
            console.log('quesID:', quesID);
            console.log('updateFields:', updateFields);

            const updateQuestion = await examModel.findOneAndUpdate(
                { _id: examID, "question._id": quesID }, // Find the exam by ID and the specific question by quesID
                {
                    $set: updateFields
                },
                { new: true }
            )
            res.status(200).json(updateQuestion)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

}

module.exports = QuestionController