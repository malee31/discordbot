const Discord = require("discord.js");
const timeFormat = require("../parts/timeFormat.js");
const connection = require("../database/mysqlConnection");
const mysqlConfig = require("./config.json").mysql;
const cooldownsTable = mysqlConfig.tables.cooldowns;

let cooldownCommands;
let useMySQL = mysqlConfig.enabled;
const cooldowns = new Discord.Collection();

module.exports = {
	createCooldown,
	cooldownCheck
};

async function cooldownCheck(message, command) {
	if(typeof command.cooldown !== "number" || command.cooldown <= 0) return true;

	const now = Date.now();

	const cooldownAmount = command.cooldown * 1000;
	const userCooldown = getCooldown(command.name, message.author.id);

	if(userCooldown) {
		const expirationTime = userCooldown + cooldownAmount;

		if(now < expirationTime) {
			let timeLeft = timeFormat((expirationTime - now) / 1000);

			if(typeof command.cooldownMessage == "function") {
				return command.cooldownMessage(message, timeLeft);
			}
			return message.reply(`Please wait ${timeLeft} before reusing the \`${command.name}\` command.`);
		}
	}

	return setCooldown(command, message.author.id, now);
}

async function createCooldown(name, yes) {
	console.log("yes")
	if(!useMySQL) {
		if(!cooldowns.get(name)) {
			cooldowns.set(name, new Discord.Collection());
			console.log(`Set Cooldown Collection for ${name}`);
		} else {
			console.warn(`Cooldown Collection for ${name} already exists`);
		}
	} else {
		if(!cooldownCommands) {
			let res;
			try {
				res = await connection.pQuery("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`=? AND `TABLE_NAME`=?",
					[mysqlConfig.database, cooldownsTable.table]);
			} catch(err) {
				console.warn("MySQL was enabled in config but didn't respond on start up. Check if MySQL is running and that the credentials provided are correct.\nReboot after fixing problems to use MySQL and discard currently running cooldowns.\nDefaulting to running without MySQL by using Collections for cooldowns instead.");
				console.warn(err);
				useMySQL = false;
				return createCooldown(name);
			}
			cooldownCommands = res.map(row => row.COLUMN_NAME);
		}

		if(!cooldownCommands.includes(name)) {
			await connection.pQuery("ALTER TABLE ?? ADD ?? INT(11) UNSIGNED", [cooldownsTable.table, name])
			console.log(`Altered table to include ${name}`);
		} else {
			console.log(`Table already includes cooldowns for ${name}`)
		}
	}
}

function setCooldown(command, id, now) {
	if(!useMySQL) {
		cooldowns.get(command.name).set(id, now);
		return true;
	} else {
		console.warn("MySQL Query Not Yet Implemented");
	}
}

function getCooldown(name, id) {
	if(!useMySQL) return cooldowns.get(name).get(id);
	else {
		console.warn("MySQL Query Not Yet Implemented");
	}
}