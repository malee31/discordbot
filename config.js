module.exports = {
	aliases: aliases,
	prefix: ">",
	minSpam: 0,
	maxSpam: 10
};

const commandAliases = {
	"bare-tree": "baretree",
	"dm-all": "dmall"
};

function aliases(command)
{
	return commandAliases[command] ? commandAliases[command] : command;
}
