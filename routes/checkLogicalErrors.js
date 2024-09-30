const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => { // Route for logical errors
  const { code } = req.body;
  const filePath = path.join(__dirname, '../temp.c');

  // Save the code to a temporary file
  fs.writeFileSync(filePath, code);

  // Run cppcheck to analyze the code for logical errors
  exec(`cppcheck --enable=warning,style,performance,portability ${filePath}`, (error, stdout, stderr) => {
    fs.unlinkSync(filePath); // Remove the temporary file

    let logicalErrors = [];
    if (stderr) {
      logicalErrors = stderr.split('\n').filter(line => line.trim() !== '').map(line => parseCppcheckError(line));
    }

    res.json({ logicalErrors });
  });
});

// Function to parse cppcheck error lines
const parseCppcheckError = (errorLine) => {
  const regex = /^(.*):(\d+): (.*)$/;
  const match = regex.exec(errorLine);
  
  if (!match) {
    return { type: 'Unknown', message: errorLine, line: 0 };
  }

  const [_, file, line, message] = match;

  let type;
  if (message.includes('uninitialized') || message.includes('leak') || message.includes('incorrect')) {
    type = 'Logical Error';
  } else {
    type = 'Warning';
  }

  return { type, message, line: parseInt(line, 10) };
};

module.exports = router;
