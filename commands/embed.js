const Discord = require("discord.js");

module.exports = {
	name: "embed",
	description: "Resends your message as an embed",
	usage: "'[Title]' '[Description]'",
	botPerms: ["SEND_MESSAGES"],
	args: 2,
	execute(message, args) {
		let textEmbed = new Discord.MessageEmbed().setColor('#808080');

		textEmbed.setTitle(args[0]);
		textEmbed.setDescription(args[1]);

		return message.channel.send({ embeds: [textEmbed] });
	},
};