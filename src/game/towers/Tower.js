import collision from "../collision/collision";
import Vect2 from "../Vect2";
import util from "../util";
import Interval from "../util/Interval";

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
	#target;
	#addMoney;
	constructor(id, { cost, dmg, pierce, range, fireRate }, x, y, width, height) {
		// this.towers.size,
		// tower.cost,
		// tower.damage,
		// tower.pierce,
		// fireRate,
		// range,
		// tile.x,
		// tile.y,
		// tile.tilesize,
		// tile.tilesize,

		this.id = id;
		this.cost = cost;
		this.dmg = dmg;
		this.pierce = pierce;
		this.pos = new Vect2(x, y);
		this.width = width;
		this.height = height;
		this.range = range;
		this.fireRate = fireRate;

		this.projectiles = [];
		this.shootInterval = new Interval(this.shoot.bind(this), fireRate, 0);
		this.maxProjectileRange = Math.floor(this.range * 1.5);
		this.color = COLORS.TOWER;
		this.highlight = false;
	}

	get circle() {
		return {
			x: this.pos.x + this.width / 2,
			y: this.pos.y + this.height / 2,
			radius: this.range,
		};
	}

	get rect() {
		return {
			x: this.pos.x,
			y: this.pos.y,
			width: this.width,
			height: this.height,
		};
	}

	get middle() {
		return new Vect2(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
	}

	init(addMoney) {
		this.#addMoney = addMoney;
	}

	isWithinRange(enemy, dist) {
		return enemy !== null && dist <= this.range;
	}

	getClosestEnemy(enemies) {
		if (enemies.length !== 0) {
			let closestEnemy = null;
			let closestDist = Infinity;

			for (let i = 0; i < enemies.length; i++) {
				const enemy = enemies[i];
				// console.log(enemy);
				const distToEnemy = Vect2.distance(this.circle, enemy.pos);
				// console.log(distToEnemy);

				if (distToEnemy < closestDist) {
					closestDist = distToEnemy;
					closestEnemy = enemy;
				}
			}

			// console.log(closestEnemy);
			// console.log(this.isWithinRange(closestEnemy, closestDist));
			if (this.isWithinRange(closestEnemy, closestDist)) {
				return closestEnemy;
			} else {
				return null;
			}
		}
	}

	outOfBounds(projectile) {
		let c = new Circle(
			Math.floor(this.pos.x + this.width / 2),
			Math.floor(this.pos.y + this.height / 2),
			this.maxProjectileRange
		);
		if (!collision.pointCircle(projectile.pos, c)) {
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
		if (collision.pointRect(mouse, rect) || (this.highlight && collision.pointCircle(mouse, this.circle))) {
			// mouse is hovered over tower
			this.highlight = true;

			Draw.setFill(COLORS.HIGHLIGHT);

			Draw.drawCircle(this.middle.x, this.middle.y, this.range, true);
		} else {
			this.highlight = false;
		}
	}

	drawPathToTarget(Draw, target) {
		if (target == null) return;
		const polar = util.polarFromPoint(target.pos.x, target.pos.y);
		const dest = new Vect2(polar.dx, polar.dy);
		const vect = Vect2.Sub(this.middle, dest);

		const new_pos = Vect2.Add(this.middle, vect.norm().mult(-25));

		Draw.setWeight(4);

		Draw.setStroke("white");
		Draw.drawLine(this.middle, dest);

		Draw.setStroke("red");
		Draw.drawLine(this.middle, new_pos);
		Draw.setWeight(1);
	}

	draw(Draw, mouse) {
		Draw.setFill(this.color);
		Draw.drawRect(this.pos.x, this.pos.y, this.width, this.height, true);
		this.drawHighlightedRange(Draw, mouse);
		this.drawRange(Draw);
		this.drawPathToTarget(Draw, this.#target);
	}

	shoot() {
		const projectile = new Projectile(
			this.middle.x,
			this.middle.y,
			60,
			60,
			this.maxProjectileRange,
			10,
			this.#addMoney
		);
		projectile.setTarget(this.#target);

		this.projectiles.push(projectile);
	}

	destroyProjectile(index) {
		// if (index > -1 && index <= this.size - 1) {
		// console.log(index);
		this.projectiles.splice(index, 1);
		// }
	}

	destroyMarkedProjectiles() {
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			if (this.projectiles[i].shouldDestroy) {
				// console.log("destroying projectile");
				this.destroyProjectile(i);
			}
		}
	}

	updateProjectiles(Draw, delta) {
		if (this.projectiles.length === 0) return;
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			this.projectiles[i].update(delta);
			this.projectiles[i].draw(Draw);

			if (this.outOfBounds(this.projectiles[i], i)) {
				this.projectiles.splice(i, 1);
			}
		}
	}

	update(Draw, enemies, delta) {
		this.#target = this.getClosestEnemy(enemies);

		if (this.#target == null) {
			return;
		}

		this.shootInterval.step(this.#target, delta);

		this.updateProjectiles(Draw, delta);
		this.destroyMarkedProjectiles();
	}
}
