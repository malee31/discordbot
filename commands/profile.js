module.exports = {
	name: "profile",
	description: "Sends your profile picture to the channel",
	execute(message) {
		return message.channel.send(`${message.author.displayAvatarURL({dynamic: true})}`);
	},
};
