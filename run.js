const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.js");
const commands = require("./command.js");

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("You While Being Updated", {type: "LISTENING"});
});

client.on('message', msg => {
	//console.log(msg);
	console.log("MSG!", msg);
	if(msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	let args = msg.content.slice(config.prefix.length).trim().split(" ");
	let command = config.aliases(args.shift().toLowerCase());
	let joined = args.join(" ");
	if(typeof commands[command] == "function") commands[command](msg, args, joined);
	switch(command)
	{
		case "greet":
		case "shutdown":
		case "tree":
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
			console.log("spamming");
			commands.spam(msg, args);
		break;
		case "test":
		case "celebrate":
			commands.say("Yay!!! I worked properly!!!");
		break;
		default:
			msg.reply("I have no idea what you are trying to say");
	}
});

client.login(process.env.discordtoken);

client.once("reconnecting", () => {
	console.log("Reconnecting, whoops");
});

client.once("disconnect", () => {
	console.log("Disconnecting. Goodbye!");
});
