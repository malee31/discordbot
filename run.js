require("dotenv").config();
const path = require("path");
const Discord = require("discord.js");
const utils = require("./parts/utils.js");
const client = utils.extendClient(new Discord.Client({ intents: require("./IntentList.js") }));
const cmdParse = require("./parts/commandParse.js");
const commandLoader = require("./parts/commandLoader.js");
const commandSearcher = require("./parts/commandSearcher.js");
const cooldownManager = require("./database/cooldownManager.js");

async function startUp() {
	console.log("Bot Starting Up");

	// Creates the MySQL table for cooldowns if it doesn't already exist and doubles as a check to see if MySQL is turned on
	await cooldownManager.createTable();

	console.log("Loading Bot Commands");
	try {
		let commandPromises = [];
		commandLoader(client.commands, path.resolve(__dirname, "commands/built-in"), commandPromises);
		commandLoader(client.commands, path.resolve(__dirname, "commands/plugins"), commandPromises);
		commandLoader(client.devcommands, path.resolve(__dirname, "commands/owner-only"), commandPromises);
		await Promise.all(commandPromises);
		console.log("Commands Successfully Loaded");
	} catch(err) {
		console.warn("Failed to load commands. Shutting down");
		console.error(err);
		process.exit(1);
	}

	console.log("Bot Logging In");
	return client.login(process.env.discordtoken);
}

client.on("messageCreate", async message => {
	if(client.shouldIgnore(message)) return;

	const prefix = client.extractPrefix(message);
	if(prefix === undefined) return;

	// Disabled multi-command support. To re-enable, uncomment line and use a for loop
	// let subcommands = message.content.slice(prefix.length).trim().split(/\|/g);
	let { command, args } = cmdParse(message.content.slice(prefix.length), { prefix });
	command = commandSearcher(client, message, command, args);
	if(command === false) return;

	if(message.channel.type === "dm" && !command.allowDM) {
		return utils.safeSend(message, "This command is unavailable in DMs");
	}

	if(message.guild) {
		// Checks if the user has permission to use the command. Overridden by permission ADMINISTRATOR
		// https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
		if(command.userPerms && !message.member.permissions.has("ADMINISTRATOR")) {
			for(const perm of command.userPerms) {
				if(!message.member.permissions.has(perm)) {
					return utils.safeSend(message, `Command requires you to have ${perm} permissions`);
				}
			}
		}

		// TODO: Check permissions for BOT and Channel Overrides:
		// https://discordjs.guide/popular-topics/permissions.html#syncing-with-a-category
		// https://discord.js.org/#/docs/main/stable/class/PermissionOverwrites
		if(command.botPerms && !message.guild.me.permissions.has("ADMINISTRATOR")) {
			for(const perm of command.botPerms) {
				if(!(message.guild.me.permissions.has(perm) || message.guild.me.permissionsIn(message.channel).has(perm))) {
					// console.log(message.guild.me.permissionsIn(message.channel).toArray())
					return utils.safeSend(message, `I need ${perm} permissions to run that command!`);
				}
			}
		}
	}

	if(args.length < command.args) {
		let reply = `Not enough arguments provided, ${message.author.toString()}!\n At least ${command.args} argument${command.args === 1 ? '' : "s"} are required.`;

		// Adds the proper usage of the command is it is provided in command.usage
		if(typeof command.usage === "string") {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return utils.safeSend(message, reply);
	}

	// Validation for supplied argument types and values if a function exists for it
	// If a command fails the validation, the cooldown will not be triggered and the command will not be run
	if(typeof command.validate === "function" && !command.validate(message, args)) {
		let reply = `The arguments provided are invalid, ${message.author.toString()}!`;

		// Adds the proper usage of the command is it is provided in command.usage
		if(command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return utils.safeSend(message, reply);
	}

	// Handles the cooldowns. Checks and sets cooldowns based on command.cooldown if it is set
	if(await cooldownManager.cooldownCheck(message, command) !== true) return;

	try {
		message.prefix = prefix;
		await command.execute(message, args);
	} catch(error) {
		console.log("CAUGHT");
		console.error(error);
		await message.reply("There was an error trying to execute that command!");
	}
});

startUp().then(() => {
	console.log("Start Up Sequence Complete");
}).catch(err => {
	console.warn("Bot Login Failed");
	console.error(err);
	process.exit(1);
});