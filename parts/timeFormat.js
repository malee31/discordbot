module.exports = function timeFormat(time) {
	let unit;

	if(time >= 3600) {
		time /= 3600;
		unit = time === 1 ? "hour" : "hours";
	} else if(time >= 60) {
		time /= 60;
		unit = time === 1 ? "minute" : "minutes";
	} else {
		unit = time === 1 ? "second" : "seconds";
	}
	return `${time.toFixed(1)} ${unit}`;
}