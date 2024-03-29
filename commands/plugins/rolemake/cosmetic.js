const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: "cosmetic",
	aliases: ["empty"],
	description: "Creates a role with no enabled permissions",
	usage: "[Hex-color (opt)] [Role Name]",
	args: 1,
	userPerms: ["MANAGE_ROLES"],
	botPerms: ["MANAGE_ROLES", "SEND_MESSAGES"],
	async execute(message, args) {
		let newRole;
		try {
			const color = /^#[0-9a-f]{6}$/.test(args[0].toLowerCase()) ? "#" + args.shift().toLowerCase().match(/(?<=^#)([a-f0-9]{6})/)[0] : "#99AAB5";
			newRole = await message.guild.roles.create({
				name: args.join(" "),
				color: color,
				hoist: true,
				permissions: [],
				mentionable: true,
				reason: `Empty role created with [rolemake cosmetic] command by ${message.author.tag}`
			});
		} catch(err) {
			return message.channel.send(`Failed to create new cosmetic role`);
		}

		return message.channel.send(`Created cosmetic role ${newRole.toString()}`);
	}
});