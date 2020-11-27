const Discord = require("discord.js");
const timeFormat = require('../parts/timeFormat');

const commandDetails = [];
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[Command Name]',
	execute(message, args) {
		let helpEmbed = new Discord.MessageEmbed()
		.setColor("#808080");

		if(commandDetails.length === 0) {
			const {commands} = message.client;
			commands.forEach((command, index) => {
				if(command instanceof Discord.Collection) {
					const pluginConfig = command["plugin.json"];
					if(index !== pluginConfig.commandTop) return;
					commandDetails.push({
						type: "plugin",
						name: pluginConfig.commandTop,
						aliases: pluginConfig.aliases,
						description: pluginConfig.description,
						commands: command
					});
				} else {
					commandDetails.push({
						type: "command",
						name: command.name,
						aliases: command.aliases,
						cooldown: command.cooldown,
						description: command.description,
						usage: command.usage
					});
				}
			})
		}

		if(!args.length) {
			helpEmbed
			.setTitle("Here are all my commands:")
			.setFooter(`You can send "${message.prefix}help [command name]" to get info on a specific command!`);

			commandDetails.forEach(command => {
				// if(command.type === "plugin") console.log(`Plugin: ${command}`)
				helpEmbed.addField(`${command.name}${command.usage ? ` ${command.usage}` : ""}${command.cooldown ? `  *[Cooldown: ${timeFormat(command.cooldown)}]*` : ""}`, command.description);
			});

			return message.channel.send(helpEmbed);
		}

		const name = args[0].toLowerCase();
		const command = commandDetails.find(c => c.name === name || (c.aliases && c.aliases.includes(name)));

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