module.exports = {
	name: 'targetdm',
	description: 'Makes the bot DM one specific user',
	usage: '[@User or User#1234] [Message]',
	args: 2,
	botPerms: ["SEND_MESSAGES"],
	execute(message, args) {
		let searchedUser = args[0];

		message.guild.members.cache.filter(member => {
			return member.user.tag === searchedUser || member.user.id === searchedUser.match(/(?<=^<@!?)\d+(?=>$)/)[0];
		}).forEach(match => {
			return match.user.send(args.slice(1).join(" "));
		});
		return message.channel.send("DM sent");
	},
};