const ResultModel = require('../models/Results')

class ResultController{
    static async createResults(req,res){
        try {
            const { examId, registrationNo, answers } = req.body
            const results = new ResultModel({
                examId: examId,
                registrationNo: registrationNo,
                answers: answers
            })
                

            await results.save()
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    static async getResultByExamID(req, res){
        try {
            const examID = req.params
            const resultsForExam = await ResultModel.find({examId: examID.id})
            res.json(resultsForExam)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = ResultController