module.exports = {
	name: "dmall",
	description: "DMs everyone in the server that isn't a bot",
	validate(message) {
		if(!message.member.hasPermission("ADMINISTRATOR")) {
			message.reply("You need administrator permissions to use that command");
			return false;
		}
		return true;
	},
	execute(message, args) {
		let sentTo = [];
		message.guild.members.cache.forEach(member => {
			member = member.user;
			if(member.bot) return;
			sentTo.push(member.username + "#" + member.discriminator);
			return member.send("Server Broadcast: " + args.join(" "));
		});
		console.log(`Sent ${args.join(" ")} to entire ${message.guild.name} server:\n${sentTo.join("\n")}`);
	},
};
