const express = require('express');
const HintController = require('../controller/HintController');
const HintAIController = require('../controller/HintAiController');


const router = express.Router();

// Create a new hint
router.post('/hints', HintController.createHint);

// Get hints by error type or message
router.get('/hints', HintController.getHints);

// Update a hint
router.put('/hints/:id', HintController.updateHint);

// Delete a hint
router.delete('/hints/:id', HintController.deleteHint);

router.post('/ai/error-type', HintAIController.getErrorType);

module.exports = router;
