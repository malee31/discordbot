module.exports = {
	name: "prefix",
	description: "Set a new prefix for the bot to respond to. Bot will still respond to its own mention. Prefix cannot contain spaces",
	usage: "[New Prefix (optional)]",
	botPerms: ["SEND_MESSAGES"],
	async execute(message, args) {
		// console.log(`Setting prefix to [${args[0]}]`)
		let reply;
		if(args.length === 0 || !message.member.permissions.has("MANAGE_GUILD")) {
			let prefix = await message.client.connection.getPrefix(message.guild.id);
			reply = `${args.length === 0 ? '' : "You need MANAGE_GUILD permissions to change the prefix!\n"}The prefix for this server is \`${prefix}\`\nUse \`${prefix}prefix [New Prefix]\` to change it`;
		} else {
			let success = await message.client.connection.setPrefix(message.guild.id, args[0]);
			if(success) {
				reply = `Prefix set to \`${args[0]}\``;
			} else {
				let prefix = await message.client.connection.getPrefix(message.guild.id);
				reply = `Custom prefixes are currently unavailable.\nPlease use \`${prefix}\`${message.prefix === prefix ? '' : ` or \`${message.prefix}\``} instead`;
			}
		}
		return message.channel.send(reply);
	}
};