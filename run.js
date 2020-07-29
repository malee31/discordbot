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
	if(msg.author.bot || !msg.content.startsWith(config.prefix)) return;
	let args = msg.content.slice(config.prefix.length).trim().split(" ");
	let command = config.aliases(args.shift().toLowerCase());
	let joined = args.join(" ");
	switch(command)
	{
		case "greet":
			commands.greet(msg);
		break;
		case "say":
			commands.say(msg, joined);
		break;
		case "echo":
			commands.echo(msg, joined);
		break;
		case "dm":
			commands.dm(msg, joined);
		break;
		case "shutdown":
			commands.shutdown(msg);
		break;
		case "dmall":
			commands.dmall(msg, joined);
		break;
		case "baretree":
			commands.tree(msg, true);
		break;
		case "tree":
			commands.tree(msg);
		break;
		case "regex":
			commands.regex(msg, args[0]);
		break;
		case "test":
		case "celebrate":
			commands.say("Yay!!! I worked properly!!!");
		break;
		/*case "spam":
			let spamLimit = parseInt(args[0]);
			if(isNaN(spamLimit)) {
				spamLimit = 0;
			}
			else
			{
				args = args.slice(1);
				spamLimit = Math.min(spamLimit, config.maxSpam);
				console.log(args);
			}
			for(let spamNumber = 0; spamNumber < spamLimit; spamNumber++)
			{
				if(args.length < 1) break;
				msg.reply(args.join(" "));
			}
		break;*/
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
