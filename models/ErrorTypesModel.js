const errorTypes = [
    { type: "end of file error", patterns: ["reached end of file while parsing", "Unexpected end of input", "Invalid or unexpected token"] },
    { type: "logical error", patterns: ["undefined is not a function", "cannot read property"] },
    { type: "symbol error", patterns: ["cannot find symbol", "TypeError", "RangeError"] },
    { type: "Semicolon error", patterns: ["';' expected", "TypeError", "RangeError"] },
    // Add more types and patterns as needed
  ];
 module.exports = errorTypes;
  