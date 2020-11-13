const config = require("../parts/config.json");

module.exports = {
	name: 'spam',
	description: 'Spams a message repeatedly',
	cooldown: 5,
	validate(message, args) {
		let repeatNum = Number.parseInt(args[0]);
		if(isNaN(repeatNum)) args.unshift(config.minSpam);
		else args[0] = Math.min(Math.max(config.minSpam, repeatNum), config.maxSpam);
		return true;
	},
	execute(message, args) {
		let text = args.slice(1).join(" ");
		console.log(`Sending ${args[0]} ${text} to the whole channel`);
		for(let spamNumber = 0; spamNumber < args[0]; spamNumber++) {
			message.channel.send(text);
		}
	},
};
