const assert = require("assert");
const argParse = require("../parts/commandParse.js");

console.log("Starting Tests on commandParse.js");

let result;

result = argParse("hello there lol");
assert(result.args.length === 2, "Length Diff: Failed to parse spaces");
assert(result.command === "hello", "Command Diff: Failed to extract command");

result = argParse("hello 'there lol'");
assert(result.args.length === 1, "Length Diff: Failed to parse single quotes");

result = argParse("hello 'th'er'e!' How ya doin' this fine g' night?");
assert(result.args.length === 8, "Length Diff: Failed to parse final quotes test");

console.log("All Tests Passed on commandParse.js");