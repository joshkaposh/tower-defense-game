import Vect2 from "../Vect2";

export default class Enemy {
	constructor(x, y, radius, velocity, color) {
		this.pos = new Vect2(x, y);
		this.radius = radius;
		this.velocity = velocity;
		this.color = color;
		this.target = null;
		this.currentPathIndex = 0;
		this.moveDelay = 2;
	}

	draw(Draw) {
		Draw.setFill(this.color);
		Draw.drawCircle(this.pos.x, this.pos.y, this.radius, true);
	}

	getNextWaypoint(path) {
		if (this.currentPathIndex >= path.length - 1) {
			// reached the end
			// decrement lives
			// destroy enemy
			return;
		}
		this.currentPathIndex++;
		this.target = path[this.currentPathIndex];
	}

	update(path, delta) {
		this.target = path[this.currentPathIndex];
		console.log(path, this.target);

		// console.log(target);
		// console.log(this.pos);
		const dirUnit = Vect2.SubBy(this.target, this.pos).norm();
		// console.log(dirUnit);
		this.pos.add(new Vect2(dirUnit.x * this.velocity * delta, dirUnit.y * this.velocity * delta));

		if (Vect2.distance(this.pos, this.target) < 0.2) {
			this.getNextWaypoint(path);
		}
		// this.currentNode
	}
}
