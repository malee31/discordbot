const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.js");
const commands = require("./command.js");

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("You While Being Updated", {type: "LISTENING"});
});

client.on('message', msg => {
	const hasText = Boolean(msg.content);
	const hasImage = msg.attachments.size !== 0;
	const hasEmbed = msg.embeds.length !== 0;
	if(msg.author.bot || !(hasText || hasImage || hasEmbed) || !msg.content.startsWith(config.prefix)) return;

	let content = msg.content.slice(config.prefix.length).trim();

	let subcommands = content.split(/\|/g);
	
	for(let commandNum = 0; commandNum < subcommands.length; commandNum++) {
		let processCommand = subcommands[commandNum].trim().split(/ |\n+/g);
		subcommands[commandNum] = {
			command: config.aliases(processCommand.shift().toLowerCase()),
			args: processCommand.join(" ").trim()
		};
	}

	for(let runningCommand = 0; runningCommand < subcommands.length; runningCommand++) {
		let command = subcommands[runningCommand].command;
		let joined = subcommands[runningCommand].args;
		let args = subcommands[runningCommand].args.split(" ");
		switch(command)
		{
			case "greet":
			case "shutdown":
			case "tree":
			case "profile":
				commands[command](msg);
			break;
			case "say":
			case "echo":
			case "dm":
			case "dmall":
				commands[command](msg, joined);
			break;
			case "baretree":
				commands.tree(msg, true);
			break;
			case "regex":
				commands.regex(msg, args[0]);
			break;
			case "spam":
				commands.spam(msg, args);
			break;
			case "test":
				console.log(joined.match(/'([^']+)'/g));
			case "celebrate":
				commands.say(msg, "Yay!!! I worked properly!!!");
			break;
			default:
				msg.reply("I have no idea what you are trying to say");
		}
	}
});

client.login(process.env.discordtoken);

client.once("reconnecting", () => {
	console.log("Reconnecting, whoops");
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});
