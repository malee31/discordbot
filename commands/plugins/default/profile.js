const { CommandTemplate } = require("../../../index.js");

module.exports = new CommandTemplate({
	name: "profile",
	description: "Sends your profile picture to the channel",
	allowDM: true,
	botPerms: ["SEND_MESSAGES"],
	execute(message) {
		return message.channel.send(`${message.author.displayAvatarURL({ dynamic: true })}`);
	},
});