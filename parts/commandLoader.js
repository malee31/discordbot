const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const cooldownManager = require("../database/cooldownManager");

const pluginConfigName = "plugin.json";
const commandTopName = "commandTop";

module.exports = loadCommands;

// Loads all commands from a folder recursively as quickly as possible by taking advantage of the fact that arrays are
// passed by reference rather than value so all Promises can be pushed into it for Promise.all([Promise Array])
// TODO: Load subcommands by category and chained arguments
function loadCommands(commandCollection, absolutePath, PromiseCollection) {
	let commandFiles;
	try {
		commandFiles = fs.readdirSync(absolutePath);
	} catch(err) {
		if(err.code === "ENOENT") {
			console.warn(`Folder at path does not exist: ${absolutePath}`);
			return;
		} else {
			console.error(err);
		}
	}
	if(commandFiles.includes(pluginConfigName)) {
		const pluginConfig = require(path.resolve(absolutePath, pluginConfigName));
		const pluginCollection = new Discord.Collection();
		pluginCollection[pluginConfigName] = pluginConfig;

		const pluginNames = pluginConfig.aliases || [];
		pluginNames.push(pluginConfig[commandTopName]);
		for(const name of pluginNames) {
			commandCollection.set(name, pluginCollection);
		}

		commandCollection = pluginCollection;
		console.log(`Loaded plugin with ${commandTopName} ${pluginConfig[commandTopName]} from ${absolutePath}`);
	}

	for(const fileName of commandFiles) {
		let itemPath = path.resolve(absolutePath, fileName);
		if(fileName.endsWith(".js")) {
			const loadedCommand = require(itemPath);
			commandCollection.set(loadedCommand.name, loadedCommand);
			if(itemPath.endsWith("regex.js")) console.log(loadedCommand.name);

			//Create cooldown table or collection if needed
			if(typeof loadedCommand.cooldown === "number" && loadedCommand.cooldown > 0) {
				let cooldownMake = cooldownManager.createCooldown(loadedCommand.name).catch(err => {
					console.warn(`Failed to create cooldown for ${loadedCommand.name}`);
					console.error(err);
				});
				if(Array.isArray(PromiseCollection)) PromiseCollection.push(cooldownMake);
			}
		} else {
			let recurse = fs.promises.lstat(itemPath).then(stat => {
				if(stat.isDirectory()) {
					console.log("SEARCHING SUBDIRECTORY: " + itemPath);
					try {
						loadCommands(commandCollection, itemPath, PromiseCollection);
					} catch(err) {
						console.warn(`Something went wrong loading commands from directory ${itemPath}`);
						console.error(err);
					}
				} else {
					console.log(`Item ${itemPath} is not a directory. Skipping...`);
				}
			}).catch(err => {
				console.warn(`Something went wrong trying to load possible directory ${itemPath}`);
				console.error(err);
			});

			if(Array.isArray(PromiseCollection)) PromiseCollection.push(recurse);
		}
	}
}