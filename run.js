const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = ">";

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	console.log(msg);
	if (msg.content.startsWith(prefix)) {
		let args = msg.content.slice(prefix.length).trim().split(" ");
		let command = args.shift().toLowerCase();
		switch(command)
		{
			case "echo":
				msg.reply(args.join(" "));
			break;
			case "dm":
				msg.reply("Of course, on it");
				msg.author.send("Here's the DM you asked for: \"" + args.join(" ") + "\"");
				msg.author.send("Here's your information: " + JSON.stringify(msg.author));
			break;
			case "shutdown":
				console.log("Shutdown requested by: " + msg.author.username + "#" + msg.author.discriminator);
				msg.reply(":(").then(() => {
					process.exit();
				});
			break;
			default:
				msg.reply("I have no idea what you are trying to say");
		}
	}
});

client.login(process.env.discordtoken);
