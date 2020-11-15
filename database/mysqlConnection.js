const mysql = require("mysql");
const config = require("../parts/config.json");
const prefixTable = config.mysql.tables.prefix;

const connectionPool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: config.mysql.database,
	connectionLimit: 10,
	queueLimit: 20
});

// Turns querying into a Promise
function pQuery(query, queryVars = []) {
	if(!Array.isArray(queryVars)) queryVars = [queryVars];

	return new Promise((resolve, reject) => {
		connectionPool.query(query, queryVars, function(err, rows, fields) {
			if (err) {
				return reject(err);
			}
			resolve(rows, fields);
		});
	});
}

async function setPrefix(guildID, newPrefix) {
	return await pQuery("INSERT INTO ?? VALUES(?, ?) ON DUPLICATE KEY UPDATE ?? = ?",
		[prefixTable.table, guildID, newPrefix, prefixTable.columns.Prefix, newPrefix]);
}

async function getPrefix(guildID) {
	let prefix = await pQuery("SELECT ?? as prefix FROM `prefix` WHERE ?? = ? LIMIT 1",
		[prefixTable.columns.Prefix, prefixTable.columns.GuildID, guildID]);
	// console.log(prefix);
	if(prefix && prefix.length === 1 && prefix[0].prefix) {
		prefix = prefix[0].prefix;
	} else {
		prefix = config.prefix;
	}
	return prefix;
}

module.exports = {
	connectionPool,
	pQuery,
	setPrefix,
	getPrefix
};