const { singleChoiceModel, multiChoiceModel, essayModel, questionModel } = require('../models/Question')
const mongoose = require('mongoose')
const examModel = require('../models/exam')



class QuestionController {

    static async createQuestion(req) {
        try {
            const { type, question, marks, time, options, correctAnswer, correctAnswers, wordLimit, answer } = req.body
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
                    wordLimit,
                    answer
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
            const { examID, quesID } = req.params;
            const data = req.body;
    
            // Find the specific exam and question by ID and question type
            const exam = await examModel.findOne({ _id: examID, "question._id": quesID });
    
            if (!exam) {
                return res.status(404).json({ message: "Exam or question not found." });
            }
    
            // Find the question to update based on discriminator key
            const question = exam.question.id(quesID);
            const questionType = question.questionType; // Get the type of the question
    
            let updatedQuestion;
            switch (questionType) {
                case 'SingleChoiceQuestion':
                    updatedQuestion = await singleChoiceModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: { options: data.options, correctAnswer: data.correctAnswer } }, // Array and field update
                        { new: true }
                    );
                    break;
                case 'MultiChoiceQuestion':
                    updatedQuestion = await multiChoiceModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: { options: data.options, correctAnswers: data.correctAnswers } }, // Update for multi-choice arrays
                        { new: true }
                    );
                    break;
                case 'EssayQuestion':
                    const updateFields = { wordLimit: data.wordLimit };
                    
                    // Include answer field only if it's provided in the request
                    if (data.answer !== undefined) {
                        updateFields.answer = data.answer; // Use undefined check to allow empty answers
                    }
    
                    updatedQuestion = await essayModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: updateFields }, // Dynamically set fields
                        { new: true }
                    );
                    break;
                default:
                    return res.status(400).json({ message: "Invalid question type." });
            }
    
            // Check if the update was successful
            if (!updatedQuestion) {
                return res.status(404).json({ message: "Question not found or update failed." });
            }
    
            res.status(200).json(updatedQuestion);
        } catch (error) {
            console.error("Error updating question:", error); // Log the error for debugging
            res.status(500).json({ message: error.message });
        }
    }
    
    






}

module.exports = QuestionController