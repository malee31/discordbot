const config = require("../parts/config.json");
const { CommandTemplate } = require("../index.js");

module.exports = new CommandTemplate({
	name: 'spam',
	description: 'Spams a message repeatedly',
	allowDM: true,
	args: 1,
	cooldown: 5,
	usage: `[Number (default: ${config.minSpam})] [Message]`,
	botPerms: ["SEND_MESSAGES"],
	validate(message, args) {
		let repeatNum = Number.parseInt(args[0]);
		if(isNaN(repeatNum)) args.unshift(config.minSpam);
		else args[0] = Math.min(Math.max(config.minSpam, repeatNum), config.maxSpam);
		return args.length > 1;
	},
	execute(message, args) {
		let text = args.slice(1).join(" ");
		// console.log(`Sending ${args[0]} ${text} to the whole channel`);
		for(let spamNumber = 0; spamNumber < args[0]; spamNumber++) {
			message.channel.send(text);
		}
	},
});