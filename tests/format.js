const assert = require("assert");
const format = require("../format.js");

console.log("Starting Tests on format.js");

let result;

result = format(["hi", "hi", "10", "100"], "ssns");
assert(JSON.stringify(result) == '["hi","hi",10,"100"]', "Failed normal formatting without spread");
console.log(result);

result = format(["hi", "hi", "10", "150", "100"], "ssn+s");
assert(JSON.stringify(result) == '["hi","hi",10,150,"100"]', "Failed formatting with spread");
console.log(result);

console.log("All Tests Passed on format.js");
