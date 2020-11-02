const config = require("./config.json");

module.exports = commandInput => {
	let content = commandInput.trim();
	if(content.startsWith(process.env.testprefix)) content = content.slice(process.env.testprefix.length).trim();
	else if(content.startsWith(config.prefix)) content = content.slice(config.prefix.length).trim();

	let splitCmd = content.split(/ |\n+/g);

	return {
		command: splitCmd.shift().toLowerCase(),
		args: parseArguments(splitCmd.join(" "))
	};
}

function parseArguments(joinedArgs) {
	if(typeof joinedArgs !== "string" || joinedArgs.trim().length === 0) return [];
	joinedArgs = joinedArgs.trim();

	let strings = joinedArgs.match(/'([^']+)'/g);
	joinedArgs = joinedArgs.replace(config.substitutionPlaceholder, "");
	joinedArgs = joinedArgs.replace(/'([^']+)'/g, config.substitutionPlaceholder);

	let args = joinedArgs.split(/ |\n+/g);
	for(let argNum = 0; argNum < args.length; argNum++) {
		if(!Array.isArray(strings) || strings.length === 0) break;
		let substituted = strings[0];
		substituted = substituted.substring(1, substituted.length - 1);
		if(args[argNum] === config.substitutionPlaceholder) {
			args[argNum] = substituted;
			strings.shift();
		} else if(args[argNum].includes(config.substitutionPlaceholder)) {
			args[argNum] = args[argNum].replace(config.substitutionPlaceholder, "");
			args.splice(argNum, 0, substituted);
			strings.shift();
		}
	}
	return args;
}