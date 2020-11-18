require('dotenv').config();
const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const client = new Discord.Client();
const cmdParse = require("./parts/commandParse.js");
const connection = require("./database/mysqlConnection");
const cooldownManager = require("./database/cooldownManager");
let mentionPrefixPattern;

async function loadCommands(commandCollection, relativePath) {
	const commandFiles = fs.readdirSync(path.resolve(__dirname, relativePath)).filter(file => file.endsWith('.js'));
	for(const fileName of commandFiles) {
		const loadedCommand = require(path.resolve(__dirname, relativePath, fileName));
		commandCollection.set(loadedCommand.name, loadedCommand);

		//Create cooldown table or collection if needed
		if(typeof loadedCommand.cooldown === "number" && loadedCommand.cooldown > 0) {
			await cooldownManager.createCooldown(loadedCommand.name);
		}
	}
}

//Commands and ADMIN ONLY commands are loaded into these two collections respectively
client.commands = new Discord.Collection();
client.devcommands = new Discord.Collection();
Promise.all([
	loadCommands(client.commands, "./commands"),
	loadCommands(client.devcommands, "./devcommands")
]).catch(err => {
	console.log("Failed to load commands. Shutting down");
	console.error(err);
	process.exit(1);
});

client.on('message', async message => {
	if(!message.content || message.author.bot || message.webhookID || message.system) return;
	if(process.env.testingserver && message.guild.name !== process.env.testingserver) return;

	//Selects which prefix to use based on the following priority: Environment, Custom Guild Prefix, and @Bot Mention
	let prefix = process.env.testPrefix || await connection.getPrefix(message.guild.id);
	if(mentionPrefixPattern.test(message.content)) prefix = message.content.match(mentionPrefixPattern)[0];

	let subcommands = message.content.slice(prefix.length).trim().split(/\|/g);
	for(let runningCommand = 0; runningCommand < subcommands.length; runningCommand++) {
		let subcommand = subcommands[runningCommand];

		let {command, args} = cmdParse(subcommand, prefix);
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
		if(await cooldownManager.cooldownCheck(message, command) !== true) return;

		try {
			command.execute(message, args);
		} catch(error) {
			console.error(error);
			await message.reply('there was an error trying to execute that command!');
		}
	}
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	mentionPrefixPattern = new RegExp(`<@!?${client.user.id}>`);
	client.user.setPresence({
		activity: {
			type: "LISTENING",
			name: "You While Being Updated"
		},
		status: "online",
		afk: false
	})
	.then(() => {
		console.log("Successfully Set Presence");
	}).catch(err => {
		console.log("Failed to Set Presence");
		console.error(err);
	});
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});

client.login(process.env.discordtoken).catch(err => {
	console.log("Could not login");
	console.error(err);
	process.exit(1);
});