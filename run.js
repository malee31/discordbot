const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = ">";
const MAX_SPAM = 10;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.options.ws.game = "Being updated";
	console.log(client.options);
});

client.on('message', msg => {
	//console.log(msg);
	if(msg.author.bot || !msg.content.startsWith(prefix)) return;
	let args = msg.content.slice(prefix.length).trim().split(" ");
	let command = args.shift().toLowerCase();
	switch(command)
	{
		case "greet":
			msg.author.send("Nice to meet you!");
		break;
		case "say":
			msg.channel.send(args.join(" "));
		break;
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
		case "tts":
			msg.channel.send("I speak! Greetings.", {tts: true});
		break;
		case "dm-all":
		case "dmall":
			//if(!msg.user)
			if(!msg.member.hasPermission("ADMINISTRATOR")) {
				msg.reply("You need administrator permissions to use that command");
				return;
			}
			let sentTo = [];
			msg.guild.members.cache.forEach(member => {
				member = member.user;
				if(member.bot) return;
				member.send("Channel Broadcast: " + args.join(" "));
				sentTo.push(member.username + "#" + member.discriminator);
			});
			msg.author.send("Sent message to: \n> " + sentTo.join(",\n> "));
		break;
		case "tree":
			let tree = {};
			msg.guild.channels.cache.forEach((channel, key, cache) => {
				if(channel.type == "category" && !Array.isArray(tree[channel.name])) tree[channel.name] = [];
				else if (channel.type !== "category")
				{
					console.log("Checking", channel, "Got", cache.get(channel.parentID));
					tree[cache.get(channel.parentID).name].push(channel.name);
				}
			});
			let treeAssembly = msg.guild.name + "\n";
			for(let category in tree)
			{
				treeAssembly += "├─" + category + "\n";
				for(let channelIndex = 0; channelIndex < tree[category].length; channelIndex++)
				{
					treeAssembly += " \|\t" + (channelIndex + 1 == tree[category].length ? "└─" : "├─") + tree[category][channelIndex] + "\n";
				}
			}
			msg.channel.send(treeAssembly);
		break;
		case "regex":
		case "test":
			let regex = new RegExp(args[0]);
			console.log("Regexp: ", regex);
			let response = "";
			let userMatches = msg.guild.members.cache.filter(member => {
				return !member.user.bot && regex.test(`${member.user.username}#${member.user.discriminator}`);
			}).forEach(match => {
				response += `> ${match.user.username}#${match.user.discriminator}\n`;
			});
			msg.channel.send(`${response}All matched the expression`);
		break;
		case "celebrate":
			msg.channel.send("Yay!!! I worked!!!");
		break;
		/*case "spam":
			let spamLimit = parseInt(args[0]);
			if(isNaN(spamLimit)) {
				spamLimit = 0;
			}
			else
			{
				args = args.slice(1);
				spamLimit = Math.min(spamLimit, MAX_SPAM);
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
