module.exports = {
	name: "prefix",
	description: "Set a new prefix for the bot to respond to. Bot will still respond to its own mention. Prefix cannot contain spaces",
	usage: "[New Prefix (optional)]",
	userPerms: ["MANAGE_GUILD"],
	botPerms: ["SEND_MESSAGES"],
	async execute(message, args) {
		// console.log(`Setting prefix to [${args[0]}]`)
		let reply;
		if(args.length === 0) {
			let prefix = await message.client.connection.getPrefix(message.guild.id);
			reply = `The prefix for this server is \`${prefix}\``;
		} else {
			let success = await message.client.connection.setPrefix(message.guild.id, args[0]);
			if(success) {
				reply = `Prefix set to \`${args[0]}\``;
			} else {
				reply = `Custom prefixes are currently unavailable.\nPlease use \`${await connection.getPrefix(message.guild.id)}\` or \`\``;
			}
		}
		return message.channel.send(reply);
	}
};