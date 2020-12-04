module.exports = {
	name: "say",
	aliases: ["echo"],
	description: "The bot will repeat what you tell it to say",
	usage: '[Message]',
	args: 1,
	botPerms: ["SEND_MESSAGES"],
	execute(message, args) {
		return message.channel.send(args.join(" "));
	},
};