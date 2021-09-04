const { CommandTemplate } = require("../../index.js");

module.exports = new CommandTemplate({
	name: 'test',
	description: 'Used for testing commands before turning them into official commands',
	async execute(message) {
		let testResult = await message.client.connection.pQuery('SELECT * FROM `prefix`')
		// console.log(await connection.getPrefix(message.guild.id));
		return message.channel.send(JSON.stringify(testResult));
	}
});