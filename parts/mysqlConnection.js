const mysql = require("mysql");

const connectionPool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "discordbot",
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

module.exports = {
	connectionPool,
	pQuery
};