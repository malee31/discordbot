module.exports = {
	name: 'test',
	description: 'Used for testing commands before turning them into official commands',
	execute(message) {
		console.log(message.author)
	},
};
