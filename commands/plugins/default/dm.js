const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: "dm",
	aliases: ["send", "sendto", "message"],
	description: "Sends a DM to a specified person or yourself",
	usage: '[@User (optional: Returns to sender by default)] [Message]',
	args: 1,
	botPerms: ["SEND_MESSAGES"],
	validate(message, args) {
		let mention = message.client.parseMention(args[0]);
		if(mention) {
			if(args.length === 1) return false;
			args[0] = mention.id;
		} else {
			args.unshift(message.author.id);
		}
		return true;
	},
	execute(message, args) {
		const target = message.guild.members.cache.get(args[0]);
		if(!target) return message.channel.send("Unable to find user");
		args.shift();

		return Promise.all([
			message.channel.send(`Sending message to ${target.toString()}\n> ${args.join(" ")}`),
			target.send(args.join(" "))
		]);
	}
});