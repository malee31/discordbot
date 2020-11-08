# What is this?
This is a general base template for a Discord Bot that supports chained commands.<br>
Allows the output of the previous command able to be used as part of the input of the next.

# How do I use it?
Install the project dependencies using `npm install` and rename the `env.txt` file to `.env` at the root of the project.<br>
Open the `.env` file and enter your Discord bot token in the `discordtoken` field in double quotes.<br>
Start your Discord Bot by running `node .` or `npm start`.<br>
There are other environment variables that can be used for testing in it that are commented out with `#` that will be covered in the testing section<br>

# Configuration
Some default configurations can be changed in `parts/config.json` such as the default prefix.<br>
If you need to change how parts of the command parsing works, edit `parts/commandParse.js` to change how it separates command arguments<br>

# Adding commands
Commands follow a pattern and are put in either the `commands/` folder or `devcommands/` folder.<br>
To create a new command, copy any existing command JavaScript file and change the fields to the name of your new command and it's usage and description.<br>
Commands placed in the `commands/` folder can be used by anyone and are run regardless of who calls them (Extra validation can be placed with a validate(message, args) field)<br>
Commands placed in the `devcommands/` folder will only be run if the user is an administrator or the owner of the bot and follow the same pattern as normal commands otherwise.

# Testing
In the `.env` file, there are a few optional settings for making a copy of the bot to use during development.<br>
First, invite the bot to a testing server or channel and uncomment whatever lines you need in `.env`<br>
The functions of the optional variables are listed below:
* `owner`: Your Discord account's id (Can be obtained with message.author.id). It allows you to use commands in the `devcommands/` folder as well as commands that need admin permissions.
* `testingserver`: The name of the server that you are testing the bot on. If this is set, the test bot will only run on a server with that name.
* `testprefix`: Allows you to set an alternative prefix for the test bot to respond to by default and ignores commands run with the original prefix.