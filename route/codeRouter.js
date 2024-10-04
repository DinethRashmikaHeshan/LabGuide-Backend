const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Code = require("../models/code");

// @route   GET /api/codes/:userId
// @desc    Get all code submissions for a specific user
// @access  Public (You can restrict this to logged-in users if needed)
router.get("/:userId", async (req, res) => {
  try {
    const codes = await Code.find({ userId: req.params.userId }); // Filter by userId
    res.json(codes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/codes/:userId
// @desc    Create a new code submission for the logged-in user
// @access  Public (You can restrict this to logged-in users if needed)
router.post(
  "/:userId",
  [
    check("code", "Code is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, title, language, username } = req.body;
    const userId = req.params.userId; // Get userId from the route parameter

    try {
      const newCode = new Code({
        code,
        title,
        language,
        userId, // Associate the submission with the user
        username,
      });

      const savedCode = await newCode.save();
      res.json(savedCode);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/codes/:id/:userId
// @desc    Get a code submission by ID and ensure it belongs to the user
// @access  Public (or Private depending on your authentication)
router.get("/:id/:userId", async (req, res) => {
  try {
    // Find the code by its ID
    const code = await Code.findById(req.params.id);

    if (!code) {
      return res.status(404).json({ msg: "Code not found" });
    }

    // Check if the code belongs to the user
    if (code.userId.toString() !== req.params.userId) {
      return res.status(403).json({ msg: "User not authorized" });
    }

    res.json(code);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/codes/:id/:userId
// @desc    Update a code submission by ID and ensure it belongs to the user
// @access  Public (You can restrict this to logged-in users if needed)
router.put(
  "/:id/:userId",
  [
    check("code", "Code is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, title, language } = req.body;

    try {
      // Find the code by ID
      let codeEntry = await Code.findById(req.params.id);

      if (!codeEntry) {
        return res.status(404).json({ msg: "Code not found" });
      }

      // Check if the code belongs to the logged-in user
      if (codeEntry.userId.toString() !== req.params.userId) {
        return res.status(403).json({ msg: "User not authorized" });
      }

      // Update the code fields if they are provided
      codeEntry.code = code || codeEntry.code;
      codeEntry.title = title || codeEntry.title;
      codeEntry.language = language || codeEntry.language;

      await codeEntry.save();
      res.json(codeEntry);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE /api/codes/:id
// @desc    Delete a code submission by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);

    if (!code) {
      return res.status(404).json({ msg: "Code not found" });
    }

    await code.deleteOne();
    res.json({ msg: "Code removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
