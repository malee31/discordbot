# What is this?
This is a general base template for a Discord Bot that supports chained commands.</br>
Allows the output of the previous command able to be used as the input of the next.

# How do I use it?
First create a folder named `testing` and add a file inside named `creds.sh`</br>
Inside `creds.sh`, type in `export <Insert Your Discord Bot Token Here>`.</br>
Run the file with `source testing/creds.sh` and run `npm run run` to start your Discord Bot

# Configuration
Some default configurations can be changed in `config.js`.</br>
If you need to change how parts of the parsing works, edit `argument.js` to change how command arguments are separated out</br>
and edit `format.js` if you want to change how argument type parsing is handled and improve it.
