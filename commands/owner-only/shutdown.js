const { CommandTemplate } = require("../../index.js");

module.exports = new CommandTemplate({
	name: 'shutdown',
	aliases: ["sd", "poweroff", "power-off"],
	description: 'Shutdown the bot for maintenance. Requires permission ADMINISTRATOR',
	allowDM: true,
	usage: "",
	validate(message) {
		console.log(`Shutdown requested by: ${message.author.username}#${message.author.discriminator}`);
		if(!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== process.env.owner) {
			message.reply("You don't have the permission to use this command.");
			return false;
		}
		return true;
	},
	execute(message) {
		console.log(`Shutdown commenced from: ${message.author.username}#${message.author.discriminator}`);
		return message.reply(":(").then(() => {
			console.log(`Shutdown completed from: ${message.author.username}#${message.author.discriminator}`);
			process.exit();
		});
	},
});