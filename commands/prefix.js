const connection = require("../database/mysqlConnection");

module.exports = {
	name: "prefix",
	description: "Set a new prefix for the bot to respond to. Bot will still respond to its own mention. Prefix cannot contain spaces",
	usage: "[new prefix]",
	validate(message, args) {
		return args[0];
	},
	async execute(message, args) {
		// console.log(`Setting prefix to [${args[0]}]`)
		await connection.setPrefix(message.guild.id, args[0]);
		return message.channel.send(`Prefix set to ${args[0]}`);
	}
};