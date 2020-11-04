const Discord = require("discord.js");
const {prefix} = require('../parts/config.json');
const timeFormat = require('../parts/timeFormat');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(message, args) {
		const {commands} = message.client;
		let helpEmbed = new Discord.MessageEmbed()
		.setColor('#808080');

		if(!args.length) {
			helpEmbed
			.setTitle("Here are all my commands:")
			.setFooter(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);

			commands.forEach(command => {
				helpEmbed.addField(`${command.name}${command.cooldown ? `  [Cooldown: ${timeFormat(command.cooldown)}]` : ""}`, `${command.description}`);
			})

			return message.channel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if(!command) {
			return message.reply('that\'s not a valid command!');
		}

		helpEmbed.setTitle(`*${prefix} ${command.name}* ${command.cooldown ? `  [Cooldown: ${timeFormat(command.cooldown)}]` : ""}`);

		if(command.description) helpEmbed.setDescription(command.description);
		if(command.aliases) helpEmbed.addField("Aliases", command.aliases.join(', '));
		if(command.usage) helpEmbed.addField("Usage", `${prefix}${command.name} ${command.usage}`);

		return message.channel.send(helpEmbed);
	},
};