const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: "say",
	aliases: ["echo"],
	description: "The bot will repeat what you tell it to say",
	allowDM: true,
	args: 1,
	usage: '[Message]',
	botPerms: ["SEND_MESSAGES"],
	execute(message, args) {
		return message.channel.send(args.join(" "));
	},
});