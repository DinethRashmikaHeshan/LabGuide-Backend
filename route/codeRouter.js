const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Code = require("../models/code");

// @route   GET /api/codes
// @desc    Get all code submissions
// @access  Public
router.get("/", async (req, res) => {
  try {
    const codes = await Code.find();
    res.json(codes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/codes
// @desc    Create a new code submission
// @access  Public
router.post(
  "/",
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
      const newCode = new Code({
        code,
        title,
        language,
      });

      const savedCode = await newCode.save();
      res.json(savedCode);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET /api/codes/:id
// @desc    Get a code submission by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);

    if (!code) {
      return res.status(404).json({ msg: "Code not found" });
    }

    res.json(code);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/codes/:id
// @desc    Update a code submission by ID
// @access  Public
router.put(
  "/:id",
  [
    check("code", "Code is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, title } = req.body;

    try {
      let codeEntry = await Code.findById(req.params.id);

      if (!codeEntry) {
        return res.status(404).json({ msg: "Code not found" });
      }

      codeEntry.code = code || codeEntry.code;
      codeEntry.title = title || codeEntry.title;

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
