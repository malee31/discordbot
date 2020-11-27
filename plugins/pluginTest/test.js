module.exports = {
	name: "test",
	description: "Tests if plugins and their commandTop works",
	execute(message, args) {
		return message.channel.send("Plugin loaded!" + (args ? "\n" + args.join(" ") : ""));
	},
};