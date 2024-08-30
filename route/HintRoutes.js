const express = require('express');
const HintController = require('../controller/HintController');
const HintAIController = require('../controller/HintAiController');


const router = express.Router();

router.post('/hints', HintController.createHint);

router.get('/hints', HintController.getHints);

router.put('/hints/:id', HintController.updateHint);

router.delete('/hints/:id', HintController.deleteHint);

router.post('/ai/error-type', HintAIController.getErrorType);

module.exports = router;
