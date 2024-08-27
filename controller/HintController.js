const Hint = require('../models/Hints');

class HintController {

  static async createHint(req, res) {
    try {
        const { errorType, hintText } = req.body;
        const hint = new Hint({
            errorType,
            hintText,
        });
        await hint.save();
        res.status(201).json(hint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static async getHints(req, res) {
    try {
        const { errorType, errorMessage } = req.query;
        const query = {};
        if (errorType) query.errorType = errorType;
        if (errorMessage) query.errorMessage = errorMessage;

        const hints = await Hint.find(query);
        res.status(200).json(hints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static async updateHint(req, res) {
    try {
        const hint = await Hint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hint) return res.status(404).json({ message: 'Hint not found' });
        res.status(200).json(hint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static async deleteHint(req, res) {
    try {
        const hint = await Hint.findByIdAndDelete(req.params.id);
        if (!hint) return res.status(404).json({ message: 'Hint not found' });
        res.status(200).json({ message: 'Hint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }
}

module.exports = HintController;
