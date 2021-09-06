const Discord = require("discord.js");
const connection = require("../database/mysqlConnection.js");

module.exports = {
	extendClient
}

function extendClient(client) {
	//Commands and ADMIN ONLY commands are loaded into these two collections respectively
	client.commands = new Discord.Collection();
	client.devcommands = new Discord.Collection();

	//Make DB easily accessible by commands
	client.connection = connection;

	//Extend client to parse mention, role, emoji, and channel strings
	client.parseMention = (str = '') => {
		if(!/^<@!?[0-9]+>$/.test(str)) return;
		return {
			id: str.match(/(?<=^<@!?)[0-9]+(?=>$)/)[0],
			hasNickname: str[2] === '!'
		};
	};
	client.parseEmoji = (str = '') => {
		if(!/^<:\w+:[0-9]+>$/.test(testString)) return;
		return {
			emojiName: str.match(/(?<=^<:)\w+(?=:[0-9]+>$)/)[0],
			id: str.match(/(?<=^<:\w+:)[0-9]+(?=>$)/)[0]
		};
	};
	client.parseRole = (str = '') => {
		if(!/^<#?[0-9]+>$/.test(str)) return;
		return str.match(/(?<=^<#)[0-9]+(?=>$)/)[0];
	};
	client.parseChannel = (str = '') => {
		if(!/^<@&[0-9]+>$/.test(str)) return;
		return str.match(/(?<=^<@&)[0-9]+(?=>$)/)[0];
	};

	client.once("disconnect", () => {
		console.log("Disconnecting. Goodbye!");
	});

	return client;
}