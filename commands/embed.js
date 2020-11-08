const Discord = require("discord.js");

module.exports = {
	name: "embed",
	description: "Resends your message as an embed",
	usage: "'[Title]' '[Description]'",
	validate(message, args) {
		return Boolean(args[1]);
	},
	execute(message, args) {
		let textEmbed = new Discord.MessageEmbed()
		.setColor('#808080');

		textEmbed.setTitle(args[0]);
		textEmbed.setDescription(args[1]);

		return message.channel.send(textEmbed);
	},
};