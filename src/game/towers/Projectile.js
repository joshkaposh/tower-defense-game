import util, { calcAtanAngle, distance } from "../util";
import Vect2 from "../Vect2";

export default class Projectile {
	constructor(x, y, vX, vY, maxDistance, radius, target) {
		this.pos = new Vect2(x, y);
		this.velocity = new Vect2(vX, vY);
		this.radius = radius;
		this.maxDistance = maxDistance;
		this.target = target;
		this.step = null;
		this.startStep = null;
		this.polar = null;
		this.unitVect = null;
	}
	get circle() {
		return {
			x: this.pos.x,
			y: this.pos.y,
			radius: this.radius,
		};
	}

	draw(Draw) {
		Draw.setFill("white");
		Draw.drawCircle(this.pos.x, this.pos.y, this.radius, true);
	}

	setPath(start, target) {
		const polar = util.polarFromPoint(target.x, target.y);
		const dest = new Vect2(polar.dx, polar.dy);
		const unitVect = Vect2.SubBy(start, dest).norm();

		this.unitVect = unitVect;
		this.polar = polar;
		this.target = dest;
		let r = this.velocity.x;
		this.step = r;
		this.startStep = r;

		// const polar = util.polarFromPoint(mouse.x, mouse.y);
		// const dest = new Vect2(polar.dx, polar.dy);
	}

	move() {
		const new_pos = Vect2.AddBy(this.pos, this.unitVect.multBy(-this.step));
		// const new_pos = Vect2.AddBy(this.pos, this.unitVect);

		this.pos.set(new_pos);

		// let new_x = util.lerp(this.pos.x, this.pos.x + this.velocity.x, 0.2);
		// let new_y = util.lerp(this.pos.y, this.pos.y + this.velocity.y, 0.2);
		// const polar = util.polarFromPoint(this.target.x, this.target.y);
		// this.pos.add()
		// let new_x = util.cosOfX(this.step, this.polar.angle);
		// let new_y = util.sinOfY(this.step, this.polar.angle);
		// console.log(new_x, new_y);
		// this.pos.add(new_x, new_y);
	}

	update() {
		this.move();
	}
}
