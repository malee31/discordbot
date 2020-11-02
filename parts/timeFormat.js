module.exports = function timeFormat(time) {
	let units = "seconds";

	if(time / 3600 >= 1) {
		time = time / 3600;
		units = time === 1 ? "hour" : "hours";
	} else if(time / 60 >= 1) {
		time = time / 60;
		units = time === 1 ? "minute" : "minutes";
	} else if(time === 1) {
		units = "second";
	}
	return `${time.toFixed(1)} ${units}`;
}
