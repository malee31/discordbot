const assert = require("assert");
const argParse = require("../arguments.js");

console.log("Starting Tests on arguments.js");

let result;

result = argParse("hello there lol");
assert(result.length == 3, "Length Diff: Failed to parse spaces");
assert(JSON.stringify(result) == "[\"hello\",\"there\",\"lol\"]", "Length Diff: Failed to parse spaces");

result = argParse("hello 'there lol'");
assert(result.length == 2, "Length Diff: Failed to parse single quotes");
assert(JSON.stringify(result) == "[\"hello\",\"there lol\"]", "Length Diff: Failed to parse spaces");

console.log("All Tests Passed on arguments.js");
