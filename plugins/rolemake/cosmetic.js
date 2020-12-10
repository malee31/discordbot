module.exports = {
	name: "cosmetic",
	aliases: ["empty"],
	description: "Creates a role with no enabled permissions",
	args: 1,
	userPerms: ["MANAGE_ROLES"],
	botPerms: ["MANAGE_ROLES", "SEND_MESSAGES"],
	async execute(message, args) {
		let newRole;
		try {
			newRole = await message.guild.roles.create({
				data: {
					name: args.join(" "),
					color: /^#[0-9a-f]{6}$/.test(args[0].toLowerCase()) ? "#" + args.shift().toLowerCase().match(/(?<=^#)([a-f0-9]{6})/)[0] : "#99AAB5",
					permissions: [],
					hoist: true,
					mentionable: true
				},
				reason: `Empty role created with [rolemake cosmetic] command by ${message.author.tag}`

			});
		} catch(err) {
			return message.channel.send(`Failed to create new cosmetic role`);
		}

		return message.channel.send(`Created cosmetic role ${newRole.toString()}`);
	}
};