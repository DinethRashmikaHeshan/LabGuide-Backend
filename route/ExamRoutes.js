const express = require('express')
const QuestionController = require('../controller/QuestionController')

const router = express.Router()

router.post('/question', QuestionController.createQuestion)
router.get('/question', QuestionController.getQuestion)

module.exports = router