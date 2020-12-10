module.exports = {
	name: "profile",
	description: "Sends your profile picture to the channel",
	allowDM: true,
	usage: "",
	botPerms: ["SEND_MESSAGES"],
	execute(message) {
		return message.channel.send(`${message.author.displayAvatarURL({dynamic: true})}`);
	},
};