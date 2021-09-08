/**
 * This file is used for separating out arguments and the command from a string as well as removing prefixes.
 * It is a self-contained and independent module from the rest of the bot so it can be copied across bots easily
 * Because of this, the config for this file is the JSON object below rather than a separate file:
 */
const DEFAULT_CONFIG = {
	// The placeholderText is used in Regex substitutions as a placeholder for arguments in single-quotes ('').
	// Use any long string of gibberish that no one will ever type for this reason:
	// WARNING: If a message contains this string, either arguments will be ordered incorrectly after parsing or the bot will crash
	placeholderText: "substitutionPlaceHolderText",
	// This will be used as the default prefix that the script will remove from the beginning of a command message.
	// Leave it as an empty string "" if you intend to remove the prefix yourself BEFORE passing the command message into this script
	defaultPrefix: "",
	// Set this to true if you would like the script to remove double spaces and trim whitespaces before and after EVERYTHING
	// Turning this off may result in commands failing if there is a space after the prefix, empty string '' arguments, and unnecessary whitespace
	obsessiveTrimming: true,
	// Function forcefully converts the command names to lowercase by default.
	// Set this to true if you would like to preserve the casing of commands as typed by the message sender
	// Example: Commands 'help', 'HELP', 'hElP', and 'Help' will all be converted into 'help' if false but kept as is if set to true
	caseSensitiveCommand: false
}
const GROUPING_REGEX = /(?<=^|\s)'[^']+'(?=$|\s)/g, UNGROUP_REGEX = /'(.+)'/,WHITESPACE_REGEX = /\s+/g;

module.exports = (commandInput, options = DEFAULT_CONFIG) => {
	options = config(options);

	const output = {
		prefix: "",
		raw: commandInput
	};

	commandInput = options.obsessiveTrim(commandInput);
	if(commandInput.startsWith(options.prefix)) {
		output.prefix = options.prefix;
		commandInput = commandInput.slice(options.prefix.length);
	}

	commandInput = parseArguments(options.obsessiveTrim(commandInput), options);

	output.command = commandInput.shift();
	output.args = commandInput;
	return output;
}

function config(options = {}) {
	options = Object.assign({}, DEFAULT_CONFIG, options);
	options.placeholderText = options.placeholderText.replace(/\s/g, "");
	options.obsessiveTrim = options.obsessiveTrimming ?
		str => str.trim() :
		str => str;
	return options;
}

/**
 * Converts a raw command input string into a list of arguments. Returns empty array by default
 * @param {string} commandInput Raw input string to be separated out into arguments. Initial trim cannot be disabled by options.obsessiveTrimming
 * @param {Object} options Options from config() function
 * @return {string[]} List of all the arguments extracted from commandInput
 */
function parseArguments(commandInput, options) {
	if(typeof commandInput !== "string" || commandInput.length === 0) return [];
	commandInput = commandInput.replace(options.placeholderText, "PLACEHOLDER-SUBSTRING-NOT-ALLOWED-IN-INPUT").trim();

	// Extracts single-quoted grouped arguments with Regex
	const groupedArgs = (commandInput.match(GROUPING_REGEX) || [])
		.map(unquoteMe => unquoteMe.match(UNGROUP_REGEX)[1])
		.map(maybeTrimMe => options.obsessiveTrim(maybeTrimMe));
	const args = commandInput
		.replace(GROUPING_REGEX, options.placeholderText)
		.split(WHITESPACE_REGEX);

	// Reinsert single-quoted grouped arguments
	return args.map(arg => arg === options.placeholderText ? groupedArgs.shift() : arg);
}