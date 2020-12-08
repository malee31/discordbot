module.exports = {
	name: "commandName",
	aliases: ["commandName2"],
	description: "commandDescription",
	usage: "[Arguments]",
	args: 0,
	allowDM: true,
	userPerms: [],
	botPerms: ["SEND_MESSAGES"],
	validate() {
		return true;
	},
	execute(message, args) {
		return;
	}
};