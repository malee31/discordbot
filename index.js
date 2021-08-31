const {CommandDataTypes, CommandDataDefaults} = require("./CommandTemplate/defaults.js");

/**
 * Basic checks for CommandData property types using only Array.isArray or typeof. No thorough checks are performed, just a rough glance
 * @param {*} val
 * @param {string} key Key being set. Used to look up intended type and for error messages
 * @return {*} Returns the value if the type matches
 * @throws {TypeError}
 */
function typeSet(val, key) {
	const intendedType = CommandDataTypes[key];
	if(intendedType === "Array" && Array.isArray(val) || typeof val === intendedType) return val;
	throw new TypeError(`The CommandData key [${key}] must be type [${intendedType}]`);
}

class CommandTemplate {
	/*
	@formatter:off Long list of getters and setters. Each of them validate their own types and does some cleaning before setting
	Not written to be legible. To understand it at a glance, just look at CommandDataTypes and it's keys/values
	All strings are trimmed, negative numbers are set to 0, and whitespace is removed from the name. Arrays are shallow copied with Array.slice()
	*/
	set name(newName) { this.CommandData.name = typeSet(newName, "name").replace(/\s/g, ""); }
	set aliases(newAliases) { this.CommandData.aliases = typeSet(newAliases, "aliases").slice(); }
	set description(newDescription) { this.CommandData.description = typeSet(newDescription, "description").trim(); }
	set args(newArgs) { this.CommandData.args = Math.max(0, typeSet(newArgs, "args")); }
	set usage(newUsage) { this.CommandData.usage = typeSet(newUsage, "usage").trim(); }
	set cooldown(newCooldown) { this.CommandData.cooldown = Math.max(0, typeSet(newCooldown, "cooldown")); }
	set allowDM(newAllowDM) { this.CommandData.allowDM = typeSet(newAllowDM, "allowDM"); }
	set userPerms(newUserPerms) { this.CommandData.userPerms = typeSet(newUserPerms, "userPerms").slice(); }
	set botPerms(newBotPerms) { this.CommandData.botPerms = typeSet(newBotPerms, "botPerms").slice(); }
	set validate(newValidate) { this.CommandData.validate = typeSet(newValidate, "validate"); }
	set execute(newExecute) { this.CommandData.execute = typeSet(newExecute, "execute"); }

	get name() { return this.CommandData.name; }
	get aliases() { return this.CommandData.aliases; }
	get description() { return this.CommandData.description; }
	get args() { return this.CommandData.args; }
	get usage() { return this.CommandData.usage; }
	get cooldown() { return this.CommandData.cooldown; }
	get allowDM() { return this.CommandData.allowDM; }
	get userPerms() { return this.CommandData.userPerms; }
	get botPerms() { return this.CommandData.botPerms; }
	get validate() { return this.CommandData.validate; }
	get execute() { return this.CommandData.execute; }
	// @formatter:on

	CommandData = {};

	constructor(commandData) {
		// Clone defaults from CommandDataDefaults
		for(const defaultKey in CommandDataDefaults) this[defaultKey] = CommandDataDefaults[defaultKey];

		// Override defaults using commandData
		for(const key in commandData) {
			if(!commandData.hasOwnProperty(key)) continue;

			if(!this.CommandData[key]) {
				console.warn(`Constructor for CommandTemplate does not use the [${key}] property\nRefrain from attaching unused keys to the command object`);
				continue;
			}

			this[key] = commandData[key];
		}
	}
}

module.exports = {
	CommandTemplate
};