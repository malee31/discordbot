const connection = require("../parts/mysqlConnection");

module.exports = {
	name: 'test',
	description: 'Used for testing commands before turning them into official commands',
	async execute(message) {
		let yes = await connection.pQuery('SELECT * FROM `prefix`')
		console.log(yes);
		return message.channel.send(yes);
	},
};
