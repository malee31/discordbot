module.exports = {
	name: "cosmetic",
	aliases: ["empty"],
	description: "Creates a role with no enabled permissions",
	userPerms: ["MANAGE_ROLES"],
	botPerms: ["MANAGE_ROLES"],
	args: 1,
	async execute(message, args) {
		const newRole = await message.guild.roles.create({
			data: {
				name: args.join(" "),
				color: /^#[0-9a-f]{6}$/.test(args[0].toLowerCase()) ? "#" + args.shift().toLowerCase().match(/(?<=^#)([a-f0-9]{6})/)[0] : "#99AAB5",
				permissions: [],
				hoist: true,
				mentionable: true
			},
			reason: `Empty role created with [rolemake cosmetic] command by ${message.author.tag}`
		});

		return message.channel.send(`Created cosmetic role ${newRole.toString()}`);
	},
};