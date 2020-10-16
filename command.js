const config = require("./config.js");
const argFormat = require("./format.js");

module.exports = {
	greet: msg => {
		msg.author.send("Nice to meet you!");
	},
	say: (msg, command) => {
		msg.channel.send(command.args);
	},
	echo: (msg, command) => {
		msg.reply(command.args);
	},
	spam: (msg, command) => {
		let format = argFormat(command.parsed, "is+");
		let spamCount = config.minSpam;
		if(typeof format[0] == "number") spamCount = Math.min(format.shift(), config.maxSpam);
		let text = format.join();
		console.log(`Sending ${spamCount} ${text} to the whole channel`);
		for(let spamNumber = 0; spamNumber < spamCount; spamNumber++) {
			msg.reply(text);
		}
	},
	dm: (msg, command) => {
			msg.reply("Of course, on it");
			msg.author.send(`Here's the DM you asked for: "${command.args}"\nHere's your information: ${JSON.stringify(msg.author)}`);
	},
	dmall: (msg, command) => {
		if(!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.reply("You need administrator permissions to use that command");
			return;
		}
		let sentTo = [];
		msg.guild.members.cache.forEach(member => {
			member = member.user;
			if(member.bot) return;
			member.send("Channel Broadcast: " + command.args);
			sentTo.push(member.username + "#" + member.discriminator);
		});
		msg.author.send("Sent message to: \n> " + sentTo.join(",\n> "));
	},
	tree: (msg) => {
		//baretree has been disabled due to reconstruction
		let bare = false;
		let tree = {};
		msg.guild.channels.cache.forEach((channel, key, cache) => {
			if(channel.type == "category" && !Array.isArray(tree[channel.name])) tree[channel.name] = [];
			else if (channel.type !== "category")
			{
				//console.log("Checking", channel, "Got", cache.get(channel.parentID));
				tree[cache.get(channel.parentID).name].push(channel.name);
			}
		});
		let treeAssembly = msg.guild.name + "\n";
		for(let category in tree)
		{
			if(!bare) treeAssembly += "├─";
			else treeAssembly += "\t";
			treeAssembly += `${category}\n`;
			for(let channelIndex = 0; channelIndex < tree[category].length; channelIndex++)
			{
				if(!bare) treeAssembly += ` \|\t${channelIndex + 1 == tree[category].length ? "└─" : "├─"}${tree[category][channelIndex]}\n`;
				else treeAssembly += `\t\t${tree[category][channelIndex]}\n`;
			}
		}
		//console.log(treeAssembly)
		msg.channel.send(treeAssembly);
	},
	regex: (msg, command) => {
		let regex = new RegExp(command.parsed[0]);
		//console.log("Regexp: ", regex);
		let response = "";
		let userMatches = msg.guild.members.cache.filter(member => {
			return !member.user.bot && regex.test(`${member.user.username}#${member.user.discriminator}`);
		}).forEach(match => {
			response += `> ${match.user.username}#${match.user.discriminator}\n`;
		});
		msg.channel.send(`${response}All matched the expression`);
	},
	targetdm: (msg, command) => {
		let format = argFormat(command.parsed, "s+");
		let searchedUser = format[0];

		let userMatches = msg.guild.members.cache.filter(member => {
			return `${member.user.username}#${member.user.discriminator}` == searchedUser;
		}).forEach(match => {
			match.user.send(format.slice(1).join(" "));
		});
		msg.channel.send("DM sent");
		
	},
	profile: (msg) => {
		msg.channel.send(`${msg.author.displayAvatarURL({ dynamic: true })}`);
	},
	shutdown: msg => {
		console.log(`Shutdown requested by: ${msg.author.username}#${msg.author.discriminator}`);
		msg.reply(":(").then(() => {
			process.exit();
		});
	}
}
