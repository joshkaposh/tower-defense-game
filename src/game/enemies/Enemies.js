import Interval from "../util/Interval";
import Enemy from "./Enemy";

export default class Enemies {
	#enemies = [];
	#path;
	#start;
	#waveCount;
	// #spawnRate = 0.25;
	// #waveLength = 20;
	// #waveCountdown = 1 / this.#waveLength;
	#decrementLivesCB;

	constructor(spawnRate = 0.5, waveLength = 20, waveCountdown = 1 / waveLength) {
		this.spawnRate = spawnRate;
		this.waveLength = waveLength;
		this.waveCountdown = waveCountdown;
		this.spawnInterval = new Interval(this.spawnEnemy.bind(this), spawnRate, 0);
		console.log(this.spawnRate, this.waveLength, this.waveCountdown);
	}

	init(node, path, decrementLivesCB) {
		this.setStart(node);
		this.#path = path;
		this.#decrementLivesCB = decrementLivesCB;
		console.log(this.waveCountdown);
	}

	setStart(node) {
		this.#start = node;
	}

	get canStartNextWave() {
		return this.waveCountdown <= 0;
	}

	get waveCount() {
		return this.#waveCount;
	}

	get enemies() {
		return this.#enemies;
	}

	get size() {
		return this.#enemies.length;
	}

	startNewWave(delta) {
		// if (this.canStartNextWave) {
		// 	// ! shoot if target is in range
		// 	// ! and can fire next shot
		// 	this.#waveCount++;
		// 	this.countdown = 1 / this.spawnRate;
		// } else {
		// 	this.countdown -= delta;
		// }
	}

	add(enemy) {
		// console.log(enemy);
		this.#enemies.push(enemy);
	}

	spawnEnemy() {
		// console.log(this);
		let pos = this.#start.middle;
		let radius = this.#start.tilesize / 2;
		let speed = 25;
		const enemy = new Enemy(pos.x, pos.y, radius, speed, "red", this.#decrementLivesCB);
		enemy.getNextWaypoint(this.#path);
		this.add(enemy);
	}

	render(Draw) {
		for (let i = 0; i < this.#enemies.length; i++) {
			this.#enemies[i].draw(Draw);
		}
	}

	remove(index) {
		if (index > -1 && index <= this.size - 1) {
			let result = this.#enemies.splice(index, 1);
			return result[0];
		}
	}

	removeMarkedEnemies() {
		for (let i = this.#enemies.length - 1; i >= 0; i--) {
			if (this.#enemies[i].shouldDestroy) {
				this.remove(i);
			}
		}
	}

	updateEnemies(delta) {
		for (let i = 0; i < this.#enemies.length; i++) {
			let enemy = this.#enemies[i];
			enemy.update(this.#path, delta);
		}
	}

	spawnEnemyAtInterval(delta) {}

	update(delta) {
		// console.log(delta);
		// this.startNewWave(delta);
		// console.log(this.spawnRate, this.waveLength, this.waveCountdown);
		this.spawnInterval.step(null, delta);

		// if (this.canStartNextWave) {
		// 	this.waveCountdown = 1 / this.spawnRate;
		// 	this.waveCount++;

		// 	console.log("starting new wave: ", this.#waveCount);
		// } else {
		// 	// console.log(this.#waveCountdown, delta);
		// 	// console.log(this.waveCountdown);
		// 	// const temp = this.waveCountdown - delta;
		// 	this.waveCountdown -= delta;
		// }

		this.updateEnemies(delta);
		this.removeMarkedEnemies();
	}
}
