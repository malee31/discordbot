const CommandDataTypes = {
	name: "string",
	aliases: "Array",
	description: "string",
	args: "number",
	usage: "string",
	cooldown: "number",
	allowDM: "boolean",
	userPerms: "Array",
	botPerms: "Array",
	validate: "function",
	execute: "function"
};

const CommandDataDefaults = {
	name: "test-command",
	aliases: [],
	description: "No Description Provided For This Command",
	args: 0,
	usage: "[Blank]",
	cooldown: 0,
	allowDM: false,
	userPerms: ["SEND_MESSAGES"],
	botPerms: ["SEND_MESSAGES"],
	validate: () => true,
	execute(message, args) {
		console.warn("Command.execute(message, args) not set: ", args, message);
		return message.channel.send("Command Functions Have Not Been Built Yet");
	}
};

module.exports = {
	CommandDataTypes,
	CommandDataDefaults
};