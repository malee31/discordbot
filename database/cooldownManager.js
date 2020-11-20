const Discord = require("discord.js");
const timeFormat = require("../parts/timeFormat.js");
const connection = require("./mysqlConnection");
const mysqlConfig = require("../parts/config.json").mysql;
const cooldownsTable = mysqlConfig.tables.cooldowns;

let cooldownCommands;
const cooldowns = new Discord.Collection();

module.exports = {
	createTable,
	createCooldown,
	cooldownCheck
};

async function createTable() {
	if(!connection.getEnabled()) return true;
	try {
		await connection.pQuery("CREATE TABLE IF NOT EXISTS ?? (?? VARCHAR(20) PRIMARY KEY)",
			[cooldownsTable.table, cooldownsTable.UserID]);
	} catch(err) {
		connection.disable("Could not create cooldowns table with MySQL", err);
	}
}

async function cooldownCheck(message, command) {
	if(typeof command.cooldown !== "number" || command.cooldown <= 0) return true;

	const now = Date.now() / 1000;

	const cooldownAmount = command.cooldown;
	const userCooldown = await getCooldown(command.name, message.author.id);

	if(userCooldown) {
		const expirationTime = userCooldown + cooldownAmount;

		if(now < expirationTime) {
			let timeLeft = timeFormat(expirationTime - now);

			if(typeof command.cooldownMessage == "function") {
				return command.cooldownMessage(message, timeLeft);
			}
			return message.reply(`Please wait ${timeLeft} before reusing the \`${command.name}\` command.`);
		}
	}

	return await setCooldown(command.name, message.author.id, now);
}

async function createCooldown(name) {
	if(!connection.getEnabled()) {
		if(!cooldowns.get(name)) {
			cooldowns.set(name, new Discord.Collection());
			console.log(`Set Cooldown Collection for ${name}`);
		} else {
			console.warn(`Cooldown Collection for ${name} already exists`);
		}
	} else {
		if(!cooldownCommands) {
			try {
				let res = await connection.pQuery("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`=? AND `TABLE_NAME`=?",
					[mysqlConfig.database, cooldownsTable.table]);
				cooldownCommands = res.map(row => row.COLUMN_NAME);
			} catch(err) {
				connection.disable();
				console.warn(err);
				return createCooldown(name);
			}
		}

		if(!cooldownCommands.includes(name)) {
			await connection.pQuery("ALTER TABLE ?? ADD ?? INT(11) UNSIGNED DEFAULT 0", [cooldownsTable.table, name])
			console.log(`Altered table to include ${name}`);
		} else {
			console.log(`Table already includes cooldowns for ${name}`)
		}
	}
}

async function setCooldown(name, id, now) {
	if(!connection.getEnabled()) {
		cooldowns.get(name).set(id, now);
	} else {
		await connection.pQuery("INSERT INTO ?? (??, ??) VALUES(?, ?) ON DUPLICATE KEY UPDATE ?? = ?",
			[cooldownsTable.table, cooldownsTable.UserID, name, id, now, name, now]);
	}
	return true;
}

async function getCooldown(name, id) {
	if(!connection.getEnabled()) return cooldowns.get(name).get(id);
	else {
		let cooldownTime = await connection.pQuery("SELECT ?? FROM ?? WHERE ?? = ?", [name, cooldownsTable.table, cooldownsTable.UserID, id]);
		return cooldownTime.length === 0 ? 0 : cooldownTime[0][name];
	}
}