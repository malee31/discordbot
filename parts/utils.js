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

	client.shouldIgnore = message => {
		// Ignores message if it is not sent by a person or if the bot is in testing mode and the message was not sent to the designated testing server
		return message.author.bot || message.webhookId || message.system || process.env.testingserver && message.guild.name !== process.env.testingserver;
	};

	client.extractPrefix = async message => {
		// Selects which prefix to use based on the following priority: Environment, @Bot Mention, and Guild Custom Prefix (Note: case-insensitive)
		let extractedPrefix = client.defaultPrefixes.find(prefixOption => message.content.toLowerCase().startsWith(prefixOption))
		if(extractedPrefix === undefined) {
			const guildPrefix = await client.connection.getPrefix(message.guild ? message.guild.id : -1);
			if(message.content.toLowerCase().startsWith(guildPrefix)) extractedPrefix = guildPrefix;
		}

		return extractedPrefix;
	};

	client.once("disconnect", () => {
		console.log("Disconnecting. Goodbye!");
	});

	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);

		client.defaultPrefixes = [`<@!${client.user.id}>`, `<@${client.user.id}>`];
		if(process.env.TEST_PREFIX) client.defaultPrefixes.unshift(process.env.TEST_PREFIX);

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