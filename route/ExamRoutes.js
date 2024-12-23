const express = require('express')
const QuestionController = require('../controller/QuestionController')
const ExamController = require('../controller/ExamController')
const { questionModel } = require('../models/Question')

const ResultsController = require('../controller/ResultsController')

const router = express.Router()

router.post('/question', QuestionController.createQuestion)
router.get('/question', QuestionController.getQuestion)
router.put('/exam/:examID/question/:quesID', QuestionController.updateQuestion)

router.post('/exam', ExamController.createExam)
router.get('/exam', ExamController.viewAllExams)
router.delete('/exam/:id', ExamController.deleteExam)
router.get('/exam/:id', ExamController.viewAllExamQuestion)
router.put('/exam/:id', ExamController.createQuestionForExam)
router.delete('/exam/:examID/question/:quesID', ExamController.deleteQuestion)

router.post('/results', ResultsController.createResults)
router.get('/results/:id', ResultsController.getResultByExamID)




module.exports = router