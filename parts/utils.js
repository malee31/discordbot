const Discord = require("discord.js");
const connection = require("../database/mysqlConnection.js");

module.exports = {
	extendClient,
	safeSend
}

/**
 * Modifies the Discord.Client instance with additional methods
 */
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
		if(!/^<:\w+:[0-9]+>$/.test(str)) return;
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

	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
		client.mentionPattern = new RegExp(`<@!?${client.user.id}>`);
		// ClientUser.setPresence has become fire-and-forget so there is no checks for whether it has been set successfully anymore
		client.user.setPresence({
			activities: [{
				type: "LISTENING",
				name: "You While Being Updated"
			}],
			status: "online",
			afk: false
		});
	});

	return client;
}

async function safeSend(message, content) {
	if(message.channel.type === "dm" || message.guild.me.permissions.has("ADMINISTRATOR") || message.guild.me.permissionsIn(message.channel).has("SEND_MESSAGES")) {
		return message.channel.send(content);
	}
}