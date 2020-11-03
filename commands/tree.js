// noinspection SpellCheckingInspection
module.exports = {
	name: "tree",
	description: "Sends the channel structure of the server",
	execute(message) {
		//baretree has been disabled due to reconstruction
		let bare = false;
		let tree = {};
		message.guild.channels.cache.forEach((channel, key, cache) => {
			if(channel.type === "category" && !Array.isArray(tree[channel.name])) tree[channel.name] = [];
			else if(channel.type !== "category") {
				//console.log("Checking", channel, "Got", cache.get(channel.parentID));
				tree[cache.get(channel.parentID).name].push(channel.name);
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
};
