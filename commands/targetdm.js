const config = require("../parts/config.json");

module.exports = {
	name: 'targetdm',
	description: 'Makes the bot DM one specific user',
	execute(message, args) {
		let searchedUser = args[0];

		let userMatches = message.guild.members.cache.filter(member => {
			return `${member.user.username}#${member.user.discriminator}` === searchedUser;
		}).forEach(match => {
			match.user.send(args.slice(1).join(" "));
		});
		return message.channel.send("DM sent");
	},
};
