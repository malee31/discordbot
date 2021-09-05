const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: "tree",
	description: "Sends the channel structure of the server",
	cooldown: 10,
	usage: "[Bare (optional)]",
	botPerms: ["SEND_MESSAGES"],
	execute(message, args) {
		let bare = args[0] && args[0].toLowerCase() === "bare";
		let tree = {};
		message.guild.channels.cache.forEach((channel, key, cache) => {
			console.log(channel);
			if(channel.type === "GUILD_CATEGORY" && !Array.isArray(tree[channel.name])) tree[channel.name] = [];
			else if(channel.type !== "GUILD_CATEGORY") {
				//console.log("Checking", channel, "Got", cache.get(channel.parentID));
				tree[cache.get(channel.parentId).name].push(channel.name);
			}
		});
		let treeAssembly = message.guild.name + "\n";
		for(let category in tree) {
			if(!bare) treeAssembly += "├─";
			else treeAssembly += "\t";
			treeAssembly += `${category}\n`;
			for(let channelIndex = 0; channelIndex < tree[category].length; channelIndex++) {
				if(!bare) treeAssembly += ` \|\t${channelIndex + 1 === tree[category].length ? "└─" : "├─"}${tree[category][channelIndex]}\n`;
				else treeAssembly += `\t\t${tree[category][channelIndex]}\n`;
			}
		}
		//console.log(treeAssembly)
		return message.channel.send(treeAssembly);
	},
});