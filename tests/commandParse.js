const assert = require("assert");
const argParse = require("../parts/commandParse.js");

console.log("Starting Tests on commandParse.js");

let result;

result = argParse("hello there lol");
assert(result.args.length === 2, "Length Diff: Failed to parse spaces");
assert(JSON.stringify(result) === '{"command":"hello","args":["there","lol"]}', "Length Diff: Failed to parse spaces");

result = argParse("hello 'there lol'");
assert(result.args.length === 1, "Length Diff: Failed to parse single quotes");
assert(JSON.stringify(result) === '{"command":"hello","args":["there lol"]}', "Length Diff: Failed to parse spaces");

console.log("All Tests Passed on commandParse.js");