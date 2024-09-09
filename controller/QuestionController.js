const {singleChoiceModel, multiChoiceModel, essayModel, questionModel} = require('../models/Question')

class QuestionController {

    static async createQuestion(req){
        try {
            const { type, question, marks, time, options, correctAnswer, correctAnswers, wordLimit } = req.body
            let Question = {}
            const single = "single"
            const multi = "multi"
            const essay = "essay"
            
            if(type === 'SingleChoice'){
                Question = new singleChoiceModel({
                    type:single,
                    question,
                    marks,
                    time,
                    options,
                    correctAnswer
                })
            }else if(type === 'MultipleChoice'){
                Question = new multiChoiceModel({
                    multi,
                    question,
                    marks,
                    time,
                    options,
                    correctAnswers
                })
            }else if(type === 'Essay'){
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

    static async getQuestion(req, res){
        try {
            const { type } = req.body
            let question = []

            if(type == 'single'){
                question = await singleChoiceModel.find({
                    type: type
                })
            }else if(type == 'multi'){
                question = await multiChoiceModel.find({
                    type: type
                })
            }else if(type == 'essay'){
                question = await essayModel.find({
                    type: type
                })
            }

            res.status(200).json({question})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    // static async updateQuestion(req, res){
    //     try {
    //         const updateQuestion = await questionModel.findByIdAndUpdate(req.params.quesID,
    //             {

    //             }
    //         )
    //     } catch (error) {
    //         res.status(500).json({message: error.message})
    //     }
    // }

}

module.exports = QuestionController