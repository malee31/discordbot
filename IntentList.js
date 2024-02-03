const { GatewayIntentBits } = require("discord.js");

// Comment and uncomment to enable or disable
module.exports = [
	// GatewayIntentBits.AutoModerationConfiguration,
	// GatewayIntentBits.AutoModerationExecution,
	GatewayIntentBits.DirectMessageReactions,
	// GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.DirectMessages,
	// GatewayIntentBits.GuildBans,
	GatewayIntentBits.GuildEmojisAndStickers,
	// GatewayIntentBits.GuildIntegrations,
	// GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
	// GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildMessages,
	// GatewayIntentBits.GuildModeration,
	// GatewayIntentBits.GuildPresences,
	// GatewayIntentBits.GuildScheduledEvents,
	// GatewayIntentBits.GuildVoiceStates,
	// GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent
];
