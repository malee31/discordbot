const connection = require("../database/mysqlConnection");

module.exports = {
	name: 'test',
	description: 'Used for testing commands before turning them into official commands',
	async execute(message) {
		let testResult = await connection.pQuery('SELECT * FROM `prefix`')
		// console.log(await connection.getPrefix(message.guild.id));
		return message.channel.send(JSON.stringify(testResult));
	},
};