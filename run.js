require('dotenv').config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const timeFormat = require('./parts/timeFormat.js');
const cmdParse = require("./parts/commandParse.js");
const connection = require("./database/mysqlConnection");

client.commands = new Discord.Collection();
client.devcommands = new Discord.Collection();
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
const devcommandFiles = fs.readdirSync(`${__dirname}/devcommands`).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`);
	client.commands.set(command.name, command);
}

for(const file of devcommandFiles) {
	const devcommand = require(`${__dirname}/devcommands/${file}`);
	client.devcommands.set(devcommand.name, devcommand);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("You While Being Updated", {type: "LISTENING"})
	.then(() => {
		console.log("Successfully Set Activity");
	}).catch(err => {
		console.log("Failed to set own activity");
		console.error(err);
	});
});

client.on('message', async message => {
	if(!message.content || !message.guild || (process.env.testingserver && message.guild.name !== process.env.testingserver)) return;
	if(message.author.bot) return;

	let prefix = process.env.testPrefix || (await connection.getPrefix(message.guild.id)).toString();
	if(!message.content.startsWith(prefix)) {
		prefix = `<@!${client.user.id}>`;
		if(!message.content.startsWith(prefix)) {
			prefix = `<@${client.user.id}>`;
			if(!message.content.startsWith(prefix)) return;
		}
	}

	let subcommands = message.content.slice(prefix.length).trim().split(/\|/g);
	for(let runningCommand = 0; runningCommand < subcommands.length; runningCommand++) {
		let subcommand = subcommands[runningCommand];

		let {command, args} = cmdParse(subcommand);
		let devcommandTest = command;
		command = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
		if(!command) {
			if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== process.env.owner) return;
			command = client.devcommands.get(devcommandTest) || client.devcommands.find(cmd => cmd.aliases && cmd.aliases.includes(devcommandTest));
			if(!command) return;
		}

		if(command.guildOnly && message.channel.type === 'dm') {
			return message.channel.send('I can\'t execute that command inside DMs!');
		}

		if(command.args && command.args <= args.length) {
			let reply = `You didn't provide enough arguments, ${message.author.toString()}!`;

			if(command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		//Validation for supplied argument types and values if a function exists for it
		if(typeof command.validate === "function" && !command.validate(message, args)) return;

		//Cooldown checks
		const now = Date.now();
		if(typeof command.cooldown === "number" && command.cooldown > 0) {
			if(!cooldowns.get(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = command.cooldown * 1000;

			if(timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if(now < expirationTime) {
					let timeLeft = timeFormat((expirationTime - now) / 1000);

					if(typeof command.cooldownMessage == "function") {
						return command.cooldownMessage(message, timeLeft);
					}
					return message.reply(`Please wait ${timeLeft} before reusing the \`${command.name}\` command.`);
				}
			}

			//Set timeouts if cooldown doesn't exist or has expired
			timestamps.set(message.author.id, now);
			//TODO: See if there is a way to remove this timeout
			setTimeout(() => timestamps.delete(message.author.id), command.cooldown * 1000);
		}

		try {
			command.execute(message, args);
		} catch(error) {
			console.error(error);
			await message.reply('there was an error trying to execute that command!');
		}
	}
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});

client.login(process.env.discordtoken).catch(err => {
	console.log("Could not login");
	console.error(err);
	process.exit(1);
});