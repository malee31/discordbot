const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: 'targetdm',
	description: 'Makes the bot DM one specific user',
	args: 2,
	usage: "[@User or 'User#1234'] [Message]",
	botPerms: ["SEND_MESSAGES"],
	validate(message, args) {
		let searchedUser = message.client.parseMention(args[0]);
		if(typeof searchedUser === "object") args[0] = searchedUser.id;
		return true;
	},
	execute(message, args) {
		let searchedUser = args.shift();

		message.guild.members.cache.find(member => {
			return member.user.tag === searchedUser || member.user.id === searchedUser;
		}).send(args.join(" "));

		return message.channel.send("DM sent");
	},
});