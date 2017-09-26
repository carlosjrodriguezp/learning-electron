module.exports = function countdown(tick) {
	var count = 3
	var timer = setInterval(function() {
		console.log(count)
		tick(count--)
		if(count === -1)
			clearInterval(timer)
	}, 1000)
}