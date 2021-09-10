const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const cooldownManager = require("../database/cooldownManager");

const PLUGIN_CONFIG_NAME = "plugin.json";
const COMMAND_TOP_NAME = "commandTop";

module.exports = loadCommands;

// Loads all commands from a folder recursively as quickly as possible by taking advantage of async functions
// (Note: require() is synchronous and bottle-necks it a bit)
// TODO: Load subcommands by category and chained arguments
async function loadCommands(commandCollection, absolutePath) {
	const fileList = [];
	try {
		fileList.push(...await fs.promises.readdir(absolutePath));
	} catch(err) {
		if(err.code === "ENOENT") {
			console.warn(`Folder at path does not exist: ${absolutePath}`);
			return Promise.resolve();
		} else throw err;
	}

	if(fileList.includes(PLUGIN_CONFIG_NAME)) {
		const pluginConfig = await fs.promises.readFile(path.resolve(absolutePath, PLUGIN_CONFIG_NAME)).then(data => JSON.parse(data.toString()));
		commandCollection = new Discord.Collection();

		[pluginConfig[COMMAND_TOP_NAME], ...(pluginConfig.aliases || [])]
			.forEach(alias => commandCollection.set(alias, commandCollection));

		console.log(`Loading plugin ${pluginConfig[COMMAND_TOP_NAME]} from ${absolutePath}`);
	}

	return Promise.all(
		fileList
			.filter(fileName => fileName !== PLUGIN_CONFIG_NAME)
			.map(fileName => path.resolve(absolutePath, fileName))
			.map(filePath => {
				if(!filePath.endsWith(".js")) {
					return fs.promises.lstat(filePath).then(stat => {
						if(!stat.isDirectory()) return console.log(`Path at ${filePath} is not a directory. Skipping...`);

						console.log("SEARCHING SUBDIRECTORY: " + filePath);
						try {
							return loadCommands(commandCollection, filePath);
						} catch(err) {
							console.warn(`Something went wrong loading commands from directory ${filePath}`);
							throw err;
						}
					});
				}
				const loadedCommand = require(filePath);
				commandCollection.set(loadedCommand.name, loadedCommand);

				//Create cooldown table or collection if needed
				if(loadedCommand.cooldown > 0) {
					return cooldownManager.createCooldown(loadedCommand.name)
						.catch(err => {
							console.warn(`Failed to create cooldown for ${loadedCommand.name}`);
							console.error(err);
						});
				}

				return Promise.resolve();
			})
	);
}