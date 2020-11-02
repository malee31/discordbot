require('dotenv').config();
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./parts/config.json");
const timeFormat = require('./parts/timeFormat.js');
const cmdParse = require("./parts/commandParse.js");

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
		console.log(err);
	});
});

client.on('message', async message => {
	if(!message.content || !message.guild || (process.env.testingserver && message.guild.name !== process.env.testingserver)) return;
	if(message.author.bot || !message.content.startsWith(process.env.testprefix || config.prefix)) return;
	/*let content = message.content.slice(config.prefix.length).trim();

	let subcommands = content.split(/\|/g);

	for(let commandNum = 0; commandNum < subcommands.length; commandNum++) {
		let processCommand = subcommands[commandNum].trim().split(/ |\n+/g);
		subcommands[commandNum] = {
			command: config.aliases(processCommand.shift().toLowerCase()),
			args: processCommand.join(" ").trim(),
			parsed: argParse(processCommand.join(" "))
		};
	}

	for(let runningCommand = 0; runningCommand < subcommands.length; runningCommand++) {
		let subcommand = subcommands[runningCommand];
		if(commands[subcommand.command]) commands[subcommand.command](message, subcommand);
		else message.reply("I have no idea what you are trying to say");
	}*/

	let {command, args} = cmdParse(message.content);
	let devcommandTest = command;
	command = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
	if(!command) {
		if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== process.env.owner) return;
		command = client.devcommands.get(devcommandTest) || client.devcommands.find(cmd => cmd.aliases && cmd.aliases.includes(devcommandTest));
		console.log("PING!");
		if(!command) return;
	}

	if(command.guildOnly && message.channel.type === 'dm') {
		return message.channel.send('I can\'t execute that command inside DMs!');
	}

	if(command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if(command.usage) {
			reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	const now = Date.now();
	if(!cooldowns.get(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = command.cooldown * 1000 || 0;

	if(timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if(now < expirationTime) {
			let timeLeft = timeFormat((expirationTime - now) / 1000);

			if(typeof command.cooldownMessage == "function") return command.cooldownMessage(message, timeLeft);
			return message.reply(`Please wait ${timeLeft} before reusing the \`${command.name}\` command.`);
		}
	}

	try {
		if(typeof command.validate === "function" && !command.validate(message, args)) return;

		if(cooldownAmount > 0) {
			timestamps.set(message.author.id, now);
			//TODO: See if there is a way to remove this timeout
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}

		command.execute(message, args);

		/*if(now > lastEvent + 1 && message.guild !== null && (typeof command.randomEvent == "boolean" && command.randomEvent)) {
			randomEvent(message);
			lastEvent = now;
		}*/
	} catch(error) {
		console.error(error);
		await message.reply('there was an error trying to execute that command!');
	}
});

client.once("reconnecting", () => {
	console.log("Reconnecting, whoops");
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});

client.login(process.env.discordtoken).catch(err => {
	console.log("Could not login");
	console.error(err);
	process.exit(1);
});
