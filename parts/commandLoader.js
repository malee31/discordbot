const fs = require("fs");
const path = require("path");
const cooldownManager = require("../database/cooldownManager");

module.exports = loadCommands;

function loadCommands(commandCollection, absolutePath, PromiseCollection, doNotReturn = true) {
	const commandFiles = fs.readdirSync(absolutePath);

	for(const fileName of commandFiles) {
		let itemPath = path.resolve(absolutePath, fileName);
		if(fileName.endsWith(".js")) {
			const loadedCommand = require(itemPath);
			commandCollection.set(loadedCommand.name, loadedCommand);

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
						loadCommands(commandCollection, itemPath, PromiseCollection, false);
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

	if(!doNotReturn) return Promise.all(PromiseCollection);
}