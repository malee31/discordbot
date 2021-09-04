const { CommandTemplate } = require("../../index.js");

module.exports = new CommandTemplate({
	name: "dmall",
	description: "DMs everyone in the server that isn't a bot",
	args: 1,
	usage: "[Message]",
	botPerms: ["SEND_MESSAGES"],
	execute(message, args) {
		let sentTo = [];
		message.guild.members.cache.forEach(member => {
			member = member.user;
			if(member.bot) return;
			sentTo.push(member.tag);
			return member.send("Server Broadcast: " + args.join(" "));
		});
		console.log(`Sent ${args.join(" ")} to entire ${message.guild.name} server:\n${sentTo.join("\n")}`);
	},
});