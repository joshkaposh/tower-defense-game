import collision from "../collision/collision";
import Vect2 from "../Vect2";
import util, { calcAtanAngle, distance } from "../util";
import Projectile from "./Projectile";
import { COLORS } from "../game";
class Circle {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
}

export default class Tower {
	constructor(id, cost, x, y, width, height, range, shotDelay) {
		this.id = id;
		this.cost = cost;
		this.pos = new util.Vect2(x, y);
		this.width = width;
		this.height = height;
		this.range = range;
		this.projectiles = [];
		this.shot_delay = shotDelay;
		this.projectile_velocity = 15;
		this.last_shot = 0;
		this.maxProjectileRange = Math.floor(this.range * 1.5);
		this.color = COLORS.TOWER;
		this.highlight = false;
	}

	get canShoot() {
		return this.last_shot >= this.shot_delay;
	}

	get circle() {
		return {
			x: this.pos.x + this.width / 2,
			y: this.pos.y + this.height / 2,
			radius: this.range,
		};
	}

	drawPathToCircle(Draw, mouse) {
		// let angle =
		const polar = util.polarFromPoint(mouse.x, mouse.y);
		const dest = new Vect2(polar.dx, polar.dy);

		const vect = Vect2.SubBy(this.pos, dest);

		const new_pos = Vect2.AddBy(this.pos, vect.norm().mult(-25));

		Draw.setWeight(4);

		Draw.setStroke("white");
		Draw.drawLine(this.pos, dest);
		Draw.setWeight(6);

		Draw.setStroke("red");
		Draw.drawLine(this.pos, new_pos);
	}

	outOfBounds(projectile) {
		// let c1 = new Circle(projectile.pos.x, projectile.pos.y, projectile.radius);
		let c2 = new Circle(
			Math.floor(this.pos.x + this.width / 2),
			Math.floor(this.pos.y + this.height / 2),
			this.maxProjectileRange
		);
		if (!collision.pointCircle(projectile.pos, c2)) {
			return true;
		}
	}

	drawRange(Draw) {
		const center = {
			x: this.pos.x + this.width / 2,
			y: this.pos.y + this.height / 2,
		};
		Draw.setStroke(COLORS.TOWER);
		Draw.drawCircle(center.x, center.y, this.range);
	}

	drawHighlightedRange(Draw, mouse) {
		const rect = { x: this.pos.x, y: this.pos.y, width: this.width, height: this.height };
		// const circle = { x: this.pos.x, y: this.pos.y, radius: this.range };
		if (collision.pointRect(mouse, rect) || (this.highlight && collision.pointCircle(mouse, this.circle))) {
			// mouse is hovered over tower
			this.highlight = true;
			const center = {
				x: this.pos.x + this.width / 2,
				y: this.pos.y + this.height / 2,
			};
			Draw.setFill(COLORS.HIGHLIGHT);

			Draw.drawCircle(center.x, center.y, this.range, true);
		} else {
			this.highlight = false;
		}
	}

	draw(Draw, mouse) {
		Draw.setFill(this.color);
		Draw.drawRect(this.pos.x, this.pos.y, this.width, this.height, true);
		this.drawHighlightedRange(Draw, mouse);
		this.drawRange(Draw);
		this.drawPathToCircle(Draw, mouse);
	}

	shoot(mouse) {
		if (this.projectiles.length > 1) {
			return;
		}
		const angle = calcAtanAngle(mouse.y, mouse.x);
		let x = Math.cos(angle);
		let y = Math.sin(angle);

		const projectile = new Projectile(this.circle.x, this.circle.y, 5, 5, this.maxProjectileRange, 10, mouse);

		projectile.setPath(this.pos, mouse);
		this.projectiles.push(projectile);
	}

	updateProjectiles(Draw) {
		if (this.projectiles.length === 0) return;
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			this.projectiles[i].update();
			this.projectiles[i].draw(Draw);

			if (this.outOfBounds(this.projectiles[i], i)) {
				this.projectiles.splice(i, 1);
			}
		}
	}

	update(Draw, mouse, delta) {
		if (collision.pointCircle(mouse, this.circle) && this.canShoot) {
			this.shoot(mouse);
			// console.log(delta);
			this.last_shot = delta;
		} else {
			this.last_shot += delta;
		}
		this.updateProjectiles(Draw);
	}
}
