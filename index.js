var queuedCalls = [];
var inactivityTime = function () {
	var t;
	var isIdle = true;


	window.onload = resetTimer;
	document.addEventListener('keydown', resetTimer);

	function process() {
		if (!isIdle) {
			return;
		}
		var task = queuedCalls.shift();
		var fn = function () {
			if (isIdle) {
				console.log('executing', task.id);
				task.fn();
				process();
			} else {
				console.log('postponing', task.id, 'not idle');
				queuedCalls.unshift(task);
			}
		};
		setTimeout(fn, 0);
	}

	function resetTimer() {
		isIdle = false;
		console.log('clearing timer, "main thread busy"');
		clearTimeout(t);
		t = setTimeout(() => {
			isIdle = true;
			process();
		}, 1000)
		// 1000 milisec = 1 sec
	}

	resetTimer();
};

for (let i = 0; i < 1000000; i++) {
	queuedCalls[i] = {
		id: i,
		fn: function () {
			console.log('executing something random', i);
		}
	}
}

inactivityTime()
