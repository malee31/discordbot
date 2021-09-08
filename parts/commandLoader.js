const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const cooldownManager = require("../database/cooldownManager");

const PLUGIN_CONFIG_NAME = "plugin.json";
const COMMAND_TOP_NAME = "commandTop";

module.exports = loadCommands;

// Loads all commands from a folder recursively as quickly as possible by taking advantage of the fact that arrays are
// passed by reference rather than value so all Promises can be pushed into it for Promise.all([Promise Array])
// TODO: Load subcommands by category and chained arguments
function loadCommands(commandCollection, absolutePath, promiseCollection) {
	let commandFiles;
	try {
		commandFiles = fs.readdirSync(absolutePath);
	} catch(err) {
		if(err.code === "ENOENT") return console.warn(`Folder at path does not exist: ${absolutePath}`);
		else throw err;
	}

	if(commandFiles.includes(PLUGIN_CONFIG_NAME)) {
		const pluginConfig = require(path.resolve(absolutePath, PLUGIN_CONFIG_NAME));
		const pluginCollection = new Discord.Collection();
		pluginCollection[PLUGIN_CONFIG_NAME] = pluginConfig;

		const pluginNames = pluginConfig.aliases || [];
		pluginNames.push(pluginConfig[COMMAND_TOP_NAME]);
		for(const name of pluginNames) {
			commandCollection.set(name, pluginCollection);
		}

		commandCollection = pluginCollection;
		console.log(`Loaded plugin ${pluginConfig[COMMAND_TOP_NAME]} from ${absolutePath}`);
	}

	for(const fileName of commandFiles) {
		let itemPath = path.resolve(absolutePath, fileName);
		if(fileName.endsWith(".js")) {
			const loadedCommand = require(itemPath);
			commandCollection.set(loadedCommand.name, loadedCommand);

			//Create cooldown table or collection if needed
			if(loadedCommand.cooldown > 0) {
				const cooldownMake = cooldownManager.createCooldown(loadedCommand.name).catch(err => {
					console.warn(`Failed to create cooldown for ${loadedCommand.name}`);
					console.error(err);
				});
				if(Array.isArray(promiseCollection)) promiseCollection.push(cooldownMake);
			}
		} else {
			const recurse = fs.promises.lstat(itemPath).then(stat => {
				if(stat.isDirectory()) {
					console.log("SEARCHING SUBDIRECTORY: " + itemPath);
					try {
						loadCommands(commandCollection, itemPath, promiseCollection);
					} catch(err) {
						console.warn(`Something went wrong loading commands from directory ${itemPath}`);
						throw err;
					}
				} else console.log(`Item ${itemPath} is not a directory. Skipping...`);
			}).catch(err => {
				console.warn(`Something went wrong trying to load possible directory ${itemPath}`);
				console.error(err);
			});

			if(Array.isArray(promiseCollection)) promiseCollection.push(recurse);
		}
	}
}