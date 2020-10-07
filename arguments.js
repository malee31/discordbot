const config = require("./config.js");

module.exports = function parseArguments(joinedArgs) {
	if(typeof joinedArgs !== "string" || joinedArgs.trim().length == 0) return [];
	joinedArgs = joinedArgs.trim();

	let strings = joinedArgs.match(/'([^']+)'/g);
	joinedArgs = joinedArgs.replace(config.substitutionPlaceholder, "");
	joinedArgs = joinedArgs.replace(/'([^']+)'/g, config.substitutionPlaceholder);

	let args = joinedArgs.split(/ |\n+/g);
	for(let argNum = 0; argNum < args.length; argNum++) {
		if(!Array.isArray(strings) || strings.length == 0) break;
		let substitutee = strings[0];
		substitutee = substitutee.substring(1, substitutee.length - 1);
		if(args[argNum] == config.substitutionPlaceholder) {
			args[argNum] = substitutee;
			strings.shift();
		} else if(args[argNum].includes(config.substitutionPlaceholder)) {
			args[argNum] = args[argNum].replace(config.substitutionPlaceholder, "");
			args.splice(argNum, 0, substitutee);
			strings.shift();
		}
	}
	return args;
}
