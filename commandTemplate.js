module.exports = {
	name: "commandName",
	aliases: ["commandName2"],
	description: "commandDescription",
	allowDM: true,
	args: 0,
	cooldown: 0,
	usage: "[Arguments]",
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	validate(message, args) {
		return true;
	},
	execute(message, args) {
		return;
	}
};