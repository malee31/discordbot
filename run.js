require('dotenv').config();
const path = require("path");
const Discord = require("discord.js");
const client = new Discord.Client();
const cmdParse = require("./parts/commandParse.js");
const commandLoader = require("./parts/commandLoader");
const commandSearcher = require("./parts/commandSearcher");
const connection = require("./database/mysqlConnection");
const cooldownManager = require("./database/cooldownManager");
let mentionPrefixPattern;

//Commands and ADMIN ONLY commands are loaded into these two collections respectively
client.commands = new Discord.Collection();
client.devcommands = new Discord.Collection();
//Make DB easily accessible by commands
client.connection = connection;

//Extend client to parse mention, role, and channel strings
client.parseMention = (testString = "") => {
	if(!/^<@!?[0-9]+>$/.test(testString)) return;
	return {
		id: testString.match(/(?<=^<@!?)[0-9]+(?=>$)/)[0],
		hasNickname: testString[2] === "!"
	};
};
client.parseRole = (testString = "") => {
	if(!/^<#?[0-9]+>$/.test(testString)) return;
	return testString.match(/(?<=^<#)[0-9]+(?=>$)/)[0];
};
client.parseChannel = (testString = "") => {
	if(!/^<@&[0-9]+>$/.test(testString)) return;
	return testString.match(/(?<=^<@&)[0-9]+(?=>$)/)[0];
};

async function startUp() {
	console.log("Bot Starting Up");

	// Creates the MySQL table for cooldowns if it doesn't already exist and doubles as a check to see if MySQL is turned on
	await cooldownManager.createTable();

	console.log("Loading Bot Commands");
	try {
		let commandPromises = [];
		commandLoader(client.commands, path.resolve(__dirname, "./commands"), commandPromises);
		commandLoader(client.commands, path.resolve(__dirname, "./plugins"), commandPromises);
		commandLoader(client.devcommands, path.resolve(__dirname, "./devcommands"), commandPromises);
		await Promise.all(commandPromises);
		console.log("Commands Successfully Loaded");
	} catch(err) {
		console.warn("Failed to load commands. Shutting down");
		console.error(err);
		process.exit(1);
	}

	console.log("Bot Login");
	return client.login(process.env.discordtoken);
}

async function safeSend(message, content) {
	if(message.channel.type === "dm" || message.guild.me.hasPermission("ADMINISTRATOR") || message.guild.me.hasPermission("SEND_MESSAGES") || message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
		return message.channel.send(content);
	}
}

client.on('message', async message => {
	if(!message.content || message.author.bot || message.webhookID || message.system) return;
	if(process.env.testingserver && message.guild.name !== process.env.testingserver) return;

	//Selects which prefix to use based on the following priority: Environment, Custom Guild Prefix, and @Bot Mention
	// TODO: Fix bug where bot won't run in DMs because of message.guild being null in DMs
	let prefix = process.env.testPrefix || await connection.getPrefix((message.guild ? message.guild.id : -1));
	if(!message.content.startsWith(prefix) && !process.env.testPrefix && mentionPrefixPattern.test(message.content)) {
		prefix = message.content.match(mentionPrefixPattern)[0];
	}

	if(!message.content.startsWith(prefix)) return;

	// Disabled multi-command support. To re-enable, uncomment line and use a for loop
	// let subcommands = message.content.slice(prefix.length).trim().split(/\|/g);

	let {command, args} = cmdParse(message.content.slice(prefix.length), prefix);
	command = commandSearcher(client, message, command, args);
	if(command === false) return;

	if(message.channel.type === 'dm' && !command.allowDM) {
		return safeSend(message, 'I can\'t execute that command inside DMs!');
	}

	if(message.guild) {
		// Checks if the user has permission to use the command. Overridden by permission ADMINISTRATOR
		// https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
		if(command.userPerms && !message.member.hasPermission("ADMINISTRATOR")) {
			for(const perm of command.userPerms) {
				if(!message.member.hasPermission(perm)) {
					return safeSend(message, `Command requires you to have ${perm} permissions`);
				}
			}
		}

		// TODO: Check permissions for BOT and Channel Overrides:
		// https://discordjs.guide/popular-topics/permissions.html#syncing-with-a-category
		// https://discord.js.org/#/docs/main/stable/class/PermissionOverwrites
		if(command.botPerms && !message.guild.me.hasPermission("ADMINISTRATOR")) {
			for(const perm of command.botPerms) {
				if(!(message.guild.me.hasPermission(perm) || message.guild.me.permissionsIn(message.channel).has(perm))) {
					// console.log(message.guild.me.permissionsIn(message.channel).toArray())
					return safeSend(message, `I need ${perm} permissions to run that command!`);
				}
			}
		}
	}

	if(typeof command.args === "number" && command.args > args.length) {
		let reply = `You didn't provide enough arguments, ${message.author.toString()}!\n At least ${command.args} argument${command.args === 1 ? "" : "s"} are required.`;

		// Adds the proper usage of the command is it is provided in command.usage
		if(command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return safeSend(message, reply);
	}

	// Validation for supplied argument types and values if a function exists for it
	// If a command fails the validation, the cooldown will not be triggered and the command will not be run
	if(typeof command.validate === "function" && !command.validate(message, args)) {
		let reply = `The arguments provided are invalid, ${message.author.toString()}!`;

		// Adds the proper usage of the command is it is provided in command.usage
		if(command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return safeSend(message, reply);
	}

	// Handles the cooldowns. Checks and sets cooldowns based on command.cooldown if it is set
	if(await cooldownManager.cooldownCheck(message, command) !== true) return;

	try {
		message.prefix = prefix;
		await command.execute(message, args);
	} catch(error) {
		console.log("CAUGHT");
		console.error(error);
		await message.reply('There was an error trying to execute that command!');
	}
});

startUp().then(() => {
	console.log("Start Up Sequence Complete");
}).catch(err => {
	console.warn("Could not login bot");
	console.error(err);
	process.exit(1);
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
		console.warn("Failed to Set Presence");
		console.error(err);
	});
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});