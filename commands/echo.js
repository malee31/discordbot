module.exports = {
	name: "echo",
	description: "The bot will repeat what you tell it to say",
	execute(message, args) {
		return message.channel.send(args.join(" "));
	},
};
