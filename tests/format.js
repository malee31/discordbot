const assert = require("assert");
const format = require("../parts/format.js");

console.log("Starting Tests on format.js");

let result;

result = format(["hi", "hi", "10", "100"], "ssns");
assert(JSON.stringify(result) === '["hi","hi",10,"100"]', "Failed normal formatting without spread");

result = format(["hi", "hi", "10", "150", "100"], "ssn+s");
assert(JSON.stringify(result) === '["hi","hi",10,150,"100"]', "Failed formatting with spread");

result = format(["100", "200", "hello", "bye", "50", "10"], "d+");
assert(JSON.stringify(result) === '[100,200,"hello","bye",50,10]', "Failed to format all as decimals and ignore strings");

result = format(["100", "200", "hello", "bye", "50", "10"], "d+");
assert(JSON.stringify(result) === '[100,200,"hello","bye",50,10]', "Failed to format all as decimals and ignore strings");

result = format(["100", "200", "hello", "bye", "50", "10"], "+");
assert(JSON.stringify(result) === '["100","200","hello","bye","50","10"]', "Failed Test with only spread without type");

result = format(["100", "200", "hello", "bye", "50", "10"], "n");
assert(JSON.stringify(result) === '[100,"200","hello","bye","50","10"]', "Failed singular argument format as number and ignore rest");

result = format(["100", "200", "hello", "150"], "z+");
assert(JSON.stringify(result) === '["100","200","hello","150"]', "Failed to format when invalid character is provided in pattern with spread");

result = format(["words", "w200", "nuhello", "150", "100", "9999", "1000"], "s+nnwn");
assert(JSON.stringify(result) === '["words","w200","nuhello",150,100,"9999",1000]', "Failed to format after spread");

console.log("All Tests Passed on format.js");