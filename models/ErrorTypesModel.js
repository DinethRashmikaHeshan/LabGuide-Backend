const errorTypes = [
    { type: "syntax error", patterns: ["Unexpected", "Unexpected end of input", "Invalid or unexpected token"] },
    { type: "logical error", patterns: ["undefined is not a function", "cannot read property"] },
    { type: "runtime error", patterns: ["ReferenceError", "TypeError", "RangeError"] },
    { type: "';' expected", patterns: ["';' expected", "TypeError", "RangeError"] },
    // Add more types and patterns as needed
  ];
 module.exports = errorTypes;
  