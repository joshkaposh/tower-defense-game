import collision from "../collision/collision";
import util, { calcAtanAngle, distance } from "../util";
import Vect2 from "../Vect2";

export default class Projectile {
	#targetPos = null;
	#target = null;
	#damageEnemy = null;
	#shouldDestroy = false;

	constructor(x, y, vX, vY, maxDistance, radius, addMoney) {
		this.pos = new Vect2(x, y);
		this.velocity = new Vect2(vX, vY);
		this.dmg = 1;
		this.speed = vX;
		this.radius = radius;
		this.maxDistance = maxDistance;
		this.addMoney = addMoney;
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

	draw(Draw) {
		Draw.setFill("white");
		Draw.drawCircle(this.pos.x, this.pos.y, this.radius, true);
	}

	setTarget(target) {
		// console.log(target);
		// console.log(target.damage(0));
		this.#damageEnemy = target.damage.bind(target);
		this.#target = target;
		this.#targetPos = target.pos.clone();

		// this.#damageEnemy = damageEnemy;
	}

	hitTarget() {
		// console.log("hit enemy");
		this.#shouldDestroy = true;
		this.#damageEnemy(this.dmg);
		this.addMoney(this.dmg);
		// this.#damageEnemy(this.damage);
	}

	move(delta) {}

	update(delta) {
		if (this.#target == null) {
			// destroy bullet
			return;
		}

		const dir = Vect2.Sub(this.#targetPos, this.pos);
		const distanceThisFrame = this.speed * delta;

		// const hit = dir.mag()
		// if () {
		// 	// hit target;
		// 	this.hitTarget();
		// 	return;
		// }

		if (dir.mag() <= distanceThisFrame || collision.circleCircle(this.circle, this.#target.circle)) {
			this.hitTarget();
			return;
		}

		// havent hit target, should move
		const dirUnit = dir.norm();
		const constantSpeed = Vect2.Mult(dirUnit, distanceThisFrame);
		// console.log(dir, distanceThisFrame);
		this.pos.add(constantSpeed);
		// this.move(delta);
	}
}
