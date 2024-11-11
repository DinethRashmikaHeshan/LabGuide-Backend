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

// Function to parse cppcheck error lines and categorize them
const parseCppcheckError = (errorLine) => {
  const regex = /^(.*):(\d+): (.*)$/;
  const match = regex.exec(errorLine);
  
  if (!match) {
    return { type: 'Unknown', message: errorLine, line: 0 };
  }

  const [_, file, line, message] = match;

  let type = 'Unknown';
  let category = 'General';

  // Categorizing based on specific messages
  if (message.includes('arrayIndexOutOfBounds')) {
    type = 'Error';
    category = 'Array index out of bounds';
  } else if (message.includes('nullPointer')) {
    type = 'Error';
    category = 'Dereferencing null pointer';
  } else if (message.includes('memleak')) {
    type = 'Error';
    category = 'Memory leak';
  } else if (message.includes('zerodiv')) {
    type = 'Error';
    category = 'Division by zero';
  } else if (message.includes('doubleFree')) {
    type = 'Error';
    category = 'Double free';
  } else if (message.includes('modifyConst')) {
    type = 'Error';
    category = 'Modifying const variable';
  } else if (message.includes('bufferOverflow')) {
    type = 'Error';
    category = 'Buffer overflow';
  } else if (message.includes('uninitPointer')) {
    type = 'Error';
    category = 'Use of uninitialized pointer';
  } else if (message.includes('unreachableCode')) {
    type = 'Error';
    category = 'Unreachable code';
  } else if (message.includes('resourceLeak')) {
    type = 'Error';
    category = 'Resource leak';
  } else if (message.includes('invalidPointer')) {
    type = 'Error';
    category = 'Invalid pointer access';
  } else if (message.includes('useAfterFree')) {
    type = 'Error';
    category = 'Use after free';
  } else if (message.includes('uninitvar')) {
    type = 'Warning';
    category = 'Uninitialized variable';
  } else if (message.includes('sizeofMisuse')) {
    type = 'Warning';
    category = 'Suspicious usage of sizeof';
  } else if (message.includes('implicitConversion')) {
    type = 'Warning';
    category = 'Implicit conversion loss of precision';
  } else if (message.includes('missingReturn')) {
    type = 'Warning';
    category = 'Missing return statement';
  } else if (message.includes('unusedParameter')) {
    type = 'Warning';
    category = 'Unused parameter';
  } else if (message.includes('unusedFunction')) {
    type = 'Warning';
    category = 'Unused function';
  } else if (message.includes('redundantCondition')) {
    type = 'Warning';
    category = 'Redundant condition';
  } else if (message.includes('suspiciousComparison')) {
    type = 'Warning';
    category = 'Suspicious comparison';
  } else if (message.includes('variableShadowing')) {
    type = 'Style';
    category = 'Variable shadowing';
  } else if (message.includes('redundantPointer')) {
    type = 'Style';
    category = 'Unnecessary pointer dereference';
  } else if (message.includes('redundantAssignment')) {
    type = 'Style';
    category = 'Redundant code';
  } else if (message.includes('unreachableBreak')) {
    type = 'Style';
    category = 'Unreachable break statement';
  } else if (message.includes('redundantReturn')) {
    type = 'Style';
    category = 'Redundant return statement';
  } else if (message.includes('inefficientContainerUse')) {
    type = 'Performance';
    category = 'Inefficient container use';
  } else if (message.includes('redundantAllocation')) {
    type = 'Performance';
    category = 'Unnecessary heap allocation';
  } else if (message.includes('redundantFunctionCall')) {
    type = 'Performance';
    category = 'Redundant function call';
  } else if (message.includes('redundantCopy')) {
    type = 'Performance';
    category = 'Unnecessary copying of variable';
  } else if (message.includes('64bitPortability')) {
    type = 'Portability';
    category = '64-bit portability issue';
  } else if (message.includes('deprecatedFunction')) {
    type = 'Portability';
    category = 'Usage of deprecated function';
  } else if (message.includes('pointerSize')) {
    type = 'Portability';
    category = 'Non-portable pointer size';
  } else if (message.includes('endianness')) {
    type = 'Portability';
    category = 'Endianness issue';
  } else if (message.includes('templateRecursion')) {
    type = 'Information';
    category = 'Template recursion limit reached';
  } else if (message.includes('inconclusive')) {
    type = 'Information';
    category = 'Inconclusive analysis';
  } else if (message.includes('configIssue')) {
    type = 'Information';
    category = 'Configuration problem';
  } else if (message.includes('templateOverflow')) {
    type = 'Information';
    category = 'Possible template instantiation overflow';
  }

  return { type, category, message, line: parseInt(line, 10) };
};

module.exports = router;
