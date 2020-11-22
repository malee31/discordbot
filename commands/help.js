const Discord = require("discord.js");
const timeFormat = require('../parts/timeFormat');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[Command Name]',
	execute(message, args) {
		const {commands} = message.client;
		let helpEmbed = new Discord.MessageEmbed()
		.setColor("#808080");

		if(!args.length) {
			helpEmbed
			.setTitle("Here are all my commands:")
			.setFooter(`You can send "${message.prefix}help [command name]" to get info on a specific command!`);

			commands.forEach(command => {
				helpEmbed.addField(`${command.name}${command.usage ? ` ${command.usage}` : ""}${command.cooldown ? `  *[Cooldown: ${timeFormat(command.cooldown)}]*` : ""}`, command.description);
			})

			return message.channel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command) {
			return message.reply("That's not a valid command!");
		}

		helpEmbed.setTitle(`*${message.prefix} ${command.name}* ${command.cooldown ? `  [Cooldown: ${timeFormat(command.cooldown)}]` : ""}`);

		if(command.description) helpEmbed.setDescription(command.description);
		if(command.aliases) helpEmbed.addField("Aliases", command.aliases.join(', '));
		if(command.usage) helpEmbed.addField("Usage", `${message.prefix}${command.name} ${command.usage}`);

		return message.channel.send(helpEmbed);
	},
};