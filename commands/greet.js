module.exports = {
	name: 'greet',
	description: 'Sincere Greetings from the Bot',
	execute(message) {
		return message.author.send("Nice to meet you!");
	},
};