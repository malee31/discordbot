// This file is used for separating out arguments and the command from a string as well as removing prefixes.
// It is a self-contained and independent module from the rest of the bot so it can be copied across bots easily
// Because of this, the config for this file is the JSON object below rather than a separate file:

const config = {
	// The placeholderText is used in Regex substitutions as a placeholder for single-quoted arguments.
	// Use a long string of gibberish since every occurrence of it will be removed from the arguments after parsing even if it didn't come from the parsing process alone.
	// This means that whenever someone says whatever is used as the placeholder in any command, that part of their command will go missing.
	placeholderText: "substitutionPlaceHolderText",
	// This will be used as the default prefix that the script will remove if it encounters it at the beginning of a command string.
	// Leave it as an empty string "" if you intend to remove the prefix yourself before passing the command string into this script
	// Is ignored on function calls where a prefix is provided to use after the command string
	defaultPrefix: "",
	// Set this to true if you would like the script to remove/trim double spaces and spaces after the prefix
	// Turning this off may result in commands failing if there is a space after the prefix, empty strings "" as arguments, and unnecessary whitespace
	obsessiveTrimming: true,
	// Keep this as false if you would like the command name to be converted into all lowercase rather than left as is
	// Keeping this off allows commands to be case-insensitive. Turning this on will leave command name casing as it was typed
	// Example: Commands 'help', 'HELP', 'hElP', and 'Help' will all be converted into 'help'
	caseSensitiveCommand: false
}

module.exports = (commandInput, prefix = config.defaultPrefix) => {
	// Initial checks. Trims obsessiveTrimming is enabled in config
	// Then removes prefix from command string if it is present and set in config or in the optional second function parameter(prefix)
	if(config.obsessiveTrimming) commandInput = commandInput.trim();
	if(commandInput.startsWith(prefix)) {
		commandInput = commandInput.slice(prefix.length);
		if(config.obsessiveTrimming) commandInput = commandInput.trim();
	}

	// Separate arguments into splitCmd and remove the first argument since it's the command and move it into commandInput
	let splitCmd = commandInput.split(/ |\n+/g);
	commandInput = splitCmd.shift();

	// Final assembly into an object {command: "commandstring", arguments: ["array", "of", "arguments"]}
	return {
		command: config.caseSensitiveCommand ? commandInput : commandInput.toLowerCase(),
		args: parseArguments(splitCmd.join(" "))
	};
}

function parseArguments(joinedArgs) {
	// Initial checks. Returns empty array if there is no string passed into the function and trims if obsessiveTrimming is enabled in config
	if(typeof joinedArgs !== "string" || joinedArgs.trim().length === 0) return [];
	if(config.obsessiveTrimming) joinedArgs = joinedArgs.trim();

	// Using config.placeholderText to take care of single quoted arguments using Regex replace and stores them in strings array []
	let strings = joinedArgs.match(/'([^']+)'/g);
	joinedArgs = joinedArgs.replace(config.placeholderText, "");
	joinedArgs = joinedArgs.replace(/'([^']+)'/g, config.placeholderText);
	// Remove single quotes from around each argument and trim if config.obsessiveTrimming is enabled
	for(let extractedNum = 0; extractedNum < strings.length; extractedNum++) {
		strings[extractedNum] = strings[extractedNum].substring(1, strings[extractedNum].length - 1);
		strings[extractedNum] = config.obsessiveTrimming ? strings[extractedNum].trim() : strings[extractedNum];
	}

	// Splitting back up the arguments by whitespace
	let args = joinedArgs.split(/ |\n+/g);

	// Resubstitutes single-quoted arguments after splitting using config.placeholderText and Regex replace from strings array []
	for(let argNum = 0; argNum < args.length; argNum++) {
		if(!Array.isArray(strings) || strings.length === 0) break;

		// Grab next thing to substitute back into arguments from strings array []

		// Checks if config.placeholderText is any of the current arguments and substitutes text back in for any matches
		if(args[argNum] === config.placeholderText) args[argNum] = strings.shift();
		else if(args[argNum].includes(config.placeholderText)) {
			// Since there are other string arguments surrounding the single-quotes, each will be separated into their own arguments.
			let separate = args.splice(argNum, 1)[0].split(config.placeholderText);

			// Insert each part of the original argument back into the argument array along with substitutions in between
			// Splits arguments that were originally like arg1'arg2'arg3 into "arg1", "arg2", "arg3"
			let offset = 0;
			while(separate.length > 0) {
				let part = separate.shift();
				if(!((offset === 0 || separate.length === 0) && part === "")) {
					args.splice(argNum + offset, 0, part);
					offset++;
					if(separate.length === 0) break;
				}
				args.splice(argNum + offset, 0, strings.shift());
				offset++;
			}
		}
	}

	//Done. Returns arguments in ["array", "of", "strings"] format
	return args;
}