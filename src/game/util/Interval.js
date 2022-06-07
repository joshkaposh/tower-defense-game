export default class Interval {
	constructor(cb, intervalsPerSecond, initialCountdown) {
		this.cb = cb;
		this.rate = intervalsPerSecond;
		this.initialCountdown = initialCountdown;
		this.countdown = initialCountdown;
	}

	get isOver() {
		return this.countdown <= 0;
	}

	step(data, delta) {
		if (this.isOver) {
			// ! shoot if target is in range
			// ! and can fire next shot

			this.cb(data);
			this.countdown = 1 / this.rate;
		} else {
			this.countdown -= delta;
			// console.log(this.countdown);
		}
	}
}
