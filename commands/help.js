const Discord = require("discord.js");
const timeFormat = require('../parts/timeFormat');

const commandDetails = [];
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	botPerms: ["SEND_MESSAGES"],
	usage: '[Command Name | Page Number]',
	allowDM: true,
	execute(message, args) {
		let helpEmbed = new Discord.MessageEmbed()
		.setTitle("Here are all my commands:")
		.setFooter(`You can send "${message.prefix}help [command name]" to get info on a specific command!`)
		.setColor("#808080");

		cacheInfo(commandDetails, message.client.commands);

		if(args.length === 0) args.push(1);

		if(!isNaN(Number.parseInt(args[0]))) {
			paginate(helpEmbed, commandDetails, args[0]);
		} else {
			singular(helpEmbed, commandDetails, message.prefix, args);
		}

		return message.channel.send(helpEmbed);
	},
};

function cacheInfo(targetArray, commands) {
	if(commandDetails.length === 0 || commandDetails !== targetArray) {
		commands.forEach((command, index) => {
			if(command instanceof Discord.Collection) {
				const pluginConfig = command["plugin.json"];
				if(index !== pluginConfig["commandTop"]) return;
				const subArray = [];
				targetArray.push({
					type: "plugin",
					name: pluginConfig["commandTop"],
					aliases: pluginConfig.aliases,
					description: pluginConfig.description,
					commands: Array.from(command.keys()),
					subcommands: subArray
				});
				cacheInfo(subArray, command);
			} else {
				targetArray.push({
					type: "command",
					name: command.name,
					aliases: command.aliases,
					cooldown: command.cooldown,
					description: command.description,
					usage: command.usage
				});
			}
		});
	}
}

function paginate(embed, commandArray, pageNum) {
	pageNum = Math.max(1, Number.parseInt(pageNum));
	if(isNaN(pageNum)) pageNum = 1;
	if(pageNum > Math.ceil(commandArray.length / 10)) {
		embed
		.setTitle(`There are only ${Math.ceil(commandArray.length / 10)} help pages!`)
		.setDescription("Type a valid number of pages for help");
	} else {
		embed
		.setFooter(`${embed.footer.text}   •   Page ${pageNum} of ${Math.ceil(commandArray.length / 10)}`);

		pageNum--;
		for(let commandNum = 0; commandNum < 10; commandNum++) {
			let index = pageNum * 10 + commandNum;
			if(index >= commandArray.length) break;

			let command = commandArray[index];
			if(command.type === "plugin") {
				embed.addField(`${command.name} *[Plugin]*`, `${command.description}\nSubcommands: ${command.commands.join(", ")}`);
			} else {
				embed.addField(`${command.name}${command.usage ? ` ${command.usage}` : ""}${command.cooldown ? `  *[Cooldown: ${timeFormat(command.cooldown)}]*` : ""}`, command.description);
			}
		}
	}
}

function singular(embed, searchArray, prefix, args, argNum = 0) {
	const name = args[argNum].toLowerCase();
	const command = searchArray.find(c => c.name === name || (c.aliases && c.aliases.includes(name)));
	if(!command) {
		embed.setTitle(`${prefix} ${args.slice(0, argNum + 1).join(" ").toLowerCase()} is not a valid command`);
	} else if(command.type === "command") {
		embed.setTitle(`*${prefix} ${args.slice(0, argNum + 1).join(" ").toLowerCase()}* ${command.cooldown ? `  [Cooldown: ${timeFormat(command.cooldown)}]` : ""}`);

		if(command.description) embed.setDescription(command.description);
		if(command.aliases) embed.addField("Aliases", command.aliases.join(', '));
		if(command.usage) embed.addField("Usage", `${prefix}${command.name} ${command.usage}`);
	} else if(argNum + 1 === args.length || !isNaN(Number.parseInt(args[argNum + 1]))) {
		embed.setTitle(`*${prefix} ${args.join(" ").toLowerCase()}*`);
		let desc = command.description || "";
		if(command.aliases) {
			if(desc) desc += `\n`;
			desc += `Aliases: ${command.aliases.join(', ')}`;
		}
		if(desc) embed.setDescription(desc);

		paginate(embed, command.subcommands, Number.parseInt(args[argNum + 1]));
	} else {
		singular(embed, command.subcommands, prefix, args, argNum + 1);
	}
}