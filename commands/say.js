module.exports = {
	name: "say",
	aliases: ["echo"],
	description: "The bot will repeat what you tell it to say",
	execute(message, args) {
		let promises = [];
		promises.push(message.reply("Of course, on it"));
		promises.push(message.author.send(`Here's the DM you asked for: "${args.join(" ")}"\nHere's your information: ${JSON.stringify(message.author)}`));
		return Promise.all(promises);
	},
};
