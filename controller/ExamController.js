const examModel = require('../models/exam')
const QuestionController = require('./QuestionController')

class ExamController{

    static async createExam(req,res){
        try {
            const { examDetail, date, time, duration } = req.body
            const exam = new examModel({
                examDetails: examDetail,
                eDate: date,
                eTime: time,
                duration: duration
            })
                

            await exam.save()
            res.status(201).json(exam)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static async viewAllExams(req,res){
        try {
            const exams = await examModel.find()
            res.status(200).json(exams)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static async deleteExam(req,res){
        try {
            const delExam = await examModel.findByIdAndDelete(req.params.id)
            res.status(200).json(delExam)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static async createQuestionForExam(req,res){
        try {
            const data = await QuestionController.createQuestion(req)
            const quesDetails = await examModel.findByIdAndUpdate(req.params.id, {$push: { question: data }})
            res.status(200).json(quesDetails)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static async viewAllExamQuestion(req,res){
        try {
            const all = await examModel.findById(req.params.id)
            const ques = all.question
            res.status(200).json(ques)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    static async deleteQuestion(req, res){
        try {
            const { examID, quesID } = req.params
            const delQuestion = await examModel.findByIdAndUpdate(examID, 
                {
                    $pull : {
                        question: {
                            _id: quesID
                        }
                    }
                }
            )
            res.status(200).json(delQuestion)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}
module.exports = ExamController