import Vect2 from "../Vect2";

export default class Enemy {
	#reachedDestination = false;
	#shouldDestroy = false;
	#decrementPlayerLives;

	constructor(x, y, radius, velocity, color, decrementPlayerLivesCB) {
		this.pos = new Vect2(x, y);
		this.radius = radius;
		this.velocity = velocity;
		this.color = color;
		this.hp = 1;
		this.target = null;
		this.currentPathIndex = 0;
		this.moveDelay = 2;
		this.#decrementPlayerLives = decrementPlayerLivesCB;
	}

	get circle() {
		return {
			x: this.pos.x,
			y: this.pos.y,
			radius: this.radius,
		};
	}

	get shouldDestroy() {
		return this.#shouldDestroy;
	}

	destroy() {
		this.#shouldDestroy = true;
		if (this.#reachedDestination) this.#decrementPlayerLives(1);
	}

	damage(dmg) {
		if (this.hp - dmg < 1) {
			this.destroy();
		}

		this.hp -= dmg;
		return true;
	}

	draw(Draw) {
		Draw.setFill(this.color);
		Draw.drawCircle(this.pos.x, this.pos.y, this.radius, true);
	}

	getNextWaypoint(path) {
		this.target = path[this.currentPathIndex];

		if (this.currentPathIndex >= path.length - 1) {
			// ! bug where enemy gets next
			// reached the end
			// decrement lives
			// destroy enemy
			this.#reachedDestination = true;
			this.destroy();
			// console.log("reached the end");
			return;
		}
		this.currentPathIndex++;
	}

	update(path, delta) {
		const target = this.target.middle;
		// console.log(target, this.pos);
		const dU = Vect2.Norm(Vect2.Sub(target, this.pos));
		const speed = this.velocity * delta;
		if (Vect2.distance(this.pos, target) < 1) {
			this.getNextWaypoint(path);
		}

		if (!this.#reachedDestination) {
			this.pos.add(new Vect2(dU.x * speed, dU.y * speed));
		}

		// this.currentNode
	}
}
