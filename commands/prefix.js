const connection = require("../parts/mysqlConnection");

module.exports = {
	name: "prefix",
	description: "Sends the channel structure of the server",
	usage: "[new prefix]",
	validate(message, args) {
		return args[0];
	},
	async execute(message, args) {
		console.log(`Setting prefix to [${args[0]}]`)

		let sol = await connection.pQuery('INSERT INTO `prefix` VALUES(?, ?)', [message.guild.id, args[0]])
		.then(results => {
			console.log(results);
			return results;
		});

		return message.channel.send(`Ok: ${sol}`);
	},
	async dbSetup() {
		await connection.pQuery("CREATE TABLE IF NOT EXISTS `prefix` (`GuildID` VARCHAR(18), `Prefix` VARCHAR(25))");
		await connection.pQuery("DESCRIBE `prefix`").then(res => {
			console.log(res);
		});
	}
};