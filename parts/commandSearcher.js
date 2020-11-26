module.exports = function commandSearch(client, message, commandName) {
	let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	// console.log(command);
	if(!command) {
		// Check developer commands if the user is the owner of the bot
		if(message.author.id !== process.env.owner) return;
		command = client.devcommands.get(commandName) || client.devcommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	}

	// TODO: Also search commands by subcategories after fixing script loading to load them
	return (!command ? false : command);
}