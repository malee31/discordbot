const Discord = require("discord.js");
const timeFormat = require("../parts/timeFormat.js");
// const connection = require("../database/mysqlConnection");
// let useMySQL = require("./config.json").mysql;

const cooldowns = new Discord.Collection();

module.exports = {
	createCooldown: name => {
		if(!cooldowns.get(name)) {
			cooldowns.set(name, new Discord.Collection());
		}
	},
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

function setCooldown(command, id, now) {
	cooldowns.get(command.name).set(id, now);
	return true;
}

function getCooldown(name, id) {
	return cooldowns.get(name).get(id);
}