module.exports = {
	greet: msg => {
		msg.author.send("Nice to meet you!");
	},
	say: (msg, text) => {
		msg.channel.send(text);
	},
	echo: (msg, text) => {
		msg.reply(text);
	},
	dm: (msg, text) => {
			msg.reply("Of course, on it");
			msg.author.send(`Here's the DM you asked for: "${text}"\nHere's your information: ${JSON.stringify(msg.author)}`);
	},
	dmall: (msg, text) => {
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
	},
	tree: (msg, bare=false) => {
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
		msg.channel.send(treeAssembly);
	},
	regex: (msg, regexString) => {
		let regex = new RegExp(regexString);
		console.log("Regexp: ", regex);
		let response = "";
		let userMatches = msg.guild.members.cache.filter(member => {
			return !member.user.bot && regex.test(`${member.user.username}#${member.user.discriminator}`);
		}).forEach(match => {
			response += `> ${match.user.username}#${match.user.discriminator}\n`;
		});
		msg.channel.send(`${response}All matched the expression`);
	},
	shutdown: msg => {
		console.log(`Shutdown requested by: ${msg.author.username}#${msg.author.discriminator}`);
		msg.reply(":(").then(() => {
			process.exit();
		});
	}
}
