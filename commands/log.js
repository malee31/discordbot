const Discord = require("discord.js");

module.exports = {
	name: "log",
	description: "Converts your message into an embed and deletes your original message if possible",
	usage: "[Content]",
	args: 1,
	execute(message, args) {
		let logEmbed = new Discord.MessageEmbed()
		.setColor('#808080');

		logEmbed.setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
		logEmbed.setDescription(args.join(" "));
		logEmbed.setTimestamp(message.createdAt);

		message.delete();

		return message.channel.send(logEmbed);
	},
};