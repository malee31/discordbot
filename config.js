module.exports = {
	aliases: aliases,
	prefix: ">",
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
