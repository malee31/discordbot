module.exports = function commandSearch(client, message, commandName) {
	let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) || commandName;
	// console.log(command);
	if(typeof command === "string") {
		// Check developer commands if the user is the owner of the bot
		if(message.author.id !== process.env.owner) return;
		command = client.devcommands.get(command) || client.devcommands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
	}
	return (!command || typeof command === "string" ? false : command);
}