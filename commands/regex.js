module.exports = {
	name: "regex",
	aliases: ["match"],
	description: "Sends a list of members who's username and discriminator match the pattern",
	execute(message, args) {
		let regex = new RegExp(args[0]);
		//console.log("Regexp: ", regex);
		let response = "";
		message.guild.members.cache.filter(member => {
			return !member.user.bot && regex.test(`${member.user.username}#${member.user.discriminator}`);
		}).forEach(match => {
			response += `> ${match.user.username}#${match.user.discriminator}: ${match.user.id}\n`;
		});
		return message.channel.send(`${response}All matched the expression`);
	},
};
