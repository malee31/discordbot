const Discord = require("discord.js");
const timeFormat = require('../parts/timeFormat');

const commandDetails = [];
let pageLimit = 0;
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[Command Name | Page Number]',
	execute(message, args) {
		let helpEmbed = new Discord.MessageEmbed()
		.setTitle("Here are all my commands:")
		.setFooter(`You can send "${message.prefix}help [command name]" to get info on a specific command!`)
		.setColor("#808080");

		cacheInfo(message.client.commands);

		if(args.length === 0) args.push(1);

		if(!isNaN(Number.parseInt(args[0]))) {
			args[0] = Number.parseInt(args[0]);
		}

		if(typeof args[0] === "number") {
			paginate(helpEmbed, args[0]);
		} else {
			singular(helpEmbed, message.prefix, args);
		}

		return message.channel.send(helpEmbed);
	},
};

function cacheInfo(commands) {
	if(commandDetails.length === 0) {
		commands.forEach((command, index) => {
			if(command instanceof Discord.Collection) {
				const pluginConfig = command["plugin.json"];
				if(index !== pluginConfig["commandTop"]) return;
				commandDetails.push({
					type: "plugin",
					name: pluginConfig["commandTop"],
					aliases: pluginConfig.aliases,
					description: pluginConfig.description,
					commands: Array.from(command.keys()),
					collection: command
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
		});

		pageLimit = Math.ceil(commandDetails.length / 10);
	}
}

function paginate(embed, pageNum) {
	pageNum = Math.max(1, pageNum);
	if(pageNum > pageLimit) {
		embed
		.setTitle(`There are only ${pageLimit} help pages!`)
		.setDescription("Type a valid number of pages for help");
	} else {
		embed
		.setFooter(`${embed.footer.text}   •   Page ${pageNum} of ${pageLimit}`);

		pageNum--;
		for(let commandNum = 0; commandNum < 10; commandNum++) {
			let index = pageNum * 10 + commandNum;
			if(index >= commandDetails.length) break;

			let command = commandDetails[index];
			if(command.type === "plugin") {
				embed.addField(`${command.name} *[Plugin]*`, `${command.description}\nSubcommands: ${command.commands.join(", ")}`);
			} else {
				embed.addField(`${command.name}${command.usage ? ` ${command.usage}` : ""}${command.cooldown ? `  *[Cooldown: ${timeFormat(command.cooldown)}]*` : ""}`, command.description);
			}
		}
	}
}

function singular(embed, prefix, args) {
	let command = commandDetails;
	for(let argNum = 0; argNum < args.length; argNum++) {
		const name = args[argNum].toLowerCase();
		command = command.find(c => c.name === name || (c.aliases && c.aliases.includes(name)));
		if(!command) {
			embed.setTitle(`${prefix} ${args.slice(0, argNum + 1).join(" ")} is not a valid command`);
			break;
			//} else if(command.type === "command") {
		} else {
			embed.setTitle(`*${prefix} ${command.name}* ${command.cooldown ? `  [Cooldown: ${timeFormat(command.cooldown)}]` : ""}`);

			if(command.description) embed.setDescription(command.description);
			if(command.aliases) embed.addField("Aliases", command.aliases.join(', '));
			if(command.usage) embed.addField("Usage", `${prefix}${command.name} ${command.usage}`);
			break;
		} /*else if(argNum + 1 === args.length) {
			paginate(embed, command);
		}*/
	}
}