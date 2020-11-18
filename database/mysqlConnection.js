const mysql = require("mysql");
const config = require("../parts/config.json");
const prefixTable = config.mysql.tables.prefix;
let enabled = Boolean(config.mysql.enabled);

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
	let prefix = config.prefix;

	if(!enabled) {
		console.warn("MySQL may be disabled. Returning default prefix instead of custom guild prefixes");
		return prefix;
	}

	try {
		let queried = await pQuery("SELECT ?? as prefix FROM ?? WHERE ?? = ? LIMIT 1",
			[prefixTable.columns.Prefix, prefixTable.table, prefixTable.columns.GuildID, guildID]);
		if(queried && queried.length === 1 && queried[0].prefix) {
			prefix = queried[0].prefix;
		}
		//console.log(prefix);
		return prefix;
	} catch(err) {
		// console.warn("MySQL may be disabled. Returning default prefix instead of custom guild prefixes");
		console.warn(err);
		//console.log(prefix);
		return prefix;
	}
}

function disable() {
	console.warn("MySQL was enabled in config but didn't respond on start up. Check if MySQL is running and that the credentials provided are correct.\nReboot after fixing problems to use MySQL and discard currently running cooldowns.\nDefaulting to running without MySQL by using Collections for cooldowns instead.");
	enabled = false;
}

function getEnabled() {
	return enabled;
}

module.exports = {
	connectionPool,
	pQuery,
	setPrefix,
	getPrefix,
	getEnabled,
	disable
};