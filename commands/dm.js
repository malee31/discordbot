module.exports = {
	name: "dm",
	aliases: ["info"],
	description: "Get your own information from Discord",
	execute(message) {
		return message.channel.send(args.join(" "));
	},
};
