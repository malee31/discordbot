const Discord = require("discord.js");

module.exports = function commandSearch(client, message, commandName, subcommandNames = []) {
	let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	// console.log(command);
	if(!command) {
		// Check developer commands if the user is the owner of the bot
		if(message.author.id !== process.env.owner) return;
		command = client.devcommands.get(commandName) || client.devcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	}

	while(command instanceof Discord.Collection) {
		if(subcommandNames.length === 0) {
			message.channel.send("Incomplete command name");
			return false;
		} else if(!command) {
			message.channel.send("Command subcategory does not exist");
			return false;
		}
		commandName = subcommandNames.shift().toLowerCase();
		command = command.get(commandName) || command.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	}

	// TODO: Also search commands by subcategories after fixing script loading to load them
	return (!command ? false : command);
}