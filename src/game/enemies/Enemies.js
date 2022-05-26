export default class Enemies {
	#enemies = [];

	get size() {
		return this.#enemies.length;
	}

	add(enemy) {
		console.log(enemy);
		this.#enemies.push(enemy);
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

	update(path, delta) {
		for (let i = 0; i < this.#enemies.length; i++) {
			let enemy = this.#enemies[i];
			enemy.update(path, delta);
		}
	}
}
