const errorTypes = require("../models/ErrorTypesModel");
const Hint = require("../models/Hints");


class HintAIController {
    static async getErrorType(req, res) {
      const { errorName } = req.body;
      
      if (!errorName) {
        return res.status(400).json({ message: "Error name is required" });
      }
  
      // Iterate over the error types and match patterns
      let matchedErrorType = null;
      for (const errorType of errorTypes) {
        for (const pattern of errorType.patterns) {
          if (errorName.includes(pattern)) {
            matchedErrorType = errorType.type;
            break;
          }
        }
        if (matchedErrorType) break;
      }
  
      if (!matchedErrorType) {
        return res.status(404).json({ errorType: "unknown error", message: "No matching error type found" });
      }
  
      // Now that we have the matched error type, let's retrieve the corresponding hints
      try {
        const hints = await Hint.find({ errorType: matchedErrorType }).select('hintText -_id');
        return res.status(200).json({ errorType: matchedErrorType, hints });
      } catch (error) {
        return res.status(500).json({ message: "Error retrieving hints", error: error.message });
      }
    }
  }
  
  module.exports = HintAIController;
  