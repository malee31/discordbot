module.exports = function parseArguments(argArray, parsePattern) {
	if(!Array.isArray(argArray) || argArray.length == 0) return [];
	if(typeof parsePattern == "string") parsePattern = parsePattern.split("");
	else if(!Array.isArray(parsePattern)) {
		console.log("Provided parse pattern not an array or string. Returning original arguments");
		return argArray;
	} else {
		parsePattern = parsePattern.slice();
	}

	let currentIndex = 0;
	let expandAs = '';
	let parse = (bit, index) => {
		switch(bit) {
			case 'n':
			case 'd':
			case 'f':
				if(!isNaN(argArray[index])) argArray[index] = Number(argArray[index]);
				else {
					console.log("Not able to parse as number: " + argArray[index]);
				}
			break;
			/*case 's':
			default:*/
		}
	}

	while(parsePattern.length > 0) {
		let bit = parsePattern.shift();
		if(parsePattern.length > 0 && parsePattern[0] == '+') {
			expandAs = bit;
			break;
		}
		parse(bit, currentIndex);
		currentIndex++;
	}

	if(expandAs !== '') {
		let backwardsCurrentIndex = argArray.length - 1;
		while(parsePattern.length > 0) {
			let bit = parsePattern.pop();
			if(bit !== '+') {
				parse(bit, backwardsCurrentIndex);
				backwardsCurrentIndex--;
			} else {
				while(backwardsCurrentIndex >= currentIndex) {
					parse(expandAs, backwardsCurrentIndex);
					backwardsCurrentIndex--;
				}
			}
		}
	}

	console.log(argArray);
	return argArray;
}
