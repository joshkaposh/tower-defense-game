import { logDOM } from "@testing-library/react";
import Tower from "./Tower";

const TOWERS = {
	standard: Tower,
};

export default class Towers {
	#towers = [];

	get size() {
		return this.#towers.length;
	}

	add(tower) {
		this.#towers.push(tower);
	}

	render(Draw, mouse) {
		for (let i = 0; i < this.#towers.length; i++) {
			this.#towers[i].draw(Draw, mouse);
		}
	}

	remove(index) {
		if (index > -1 && index <= this.size - 1) {
			let result = this.#towers.splice(index, 1);
			return result[0];
		}
	}

	update(Draw, mouse, enemies, delta) {
		for (let i = 0; i < this.#towers.length; i++) {
			let tower = this.#towers[i];
			tower.update(Draw, enemies, delta);
		}
	}
}
