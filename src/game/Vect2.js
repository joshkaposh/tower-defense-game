export default class Vect2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	norm() {
		let m = this.mag();
		if (m > 0) {
			this.div(m);
			return this;
		}
	}

	static distance(v, w) {
		return Math.sqrt(Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2));
	}

	static Mag(vect) {
		return Math.sqrt(vect.x * vect.x + vect.y * vect.y);
	}

	static AddBy(vect1, vect2) {
		return new Vect2(vect1.x + vect2.x, vect1.y + vect2.y);
	}

	addBy(vect) {
		return new Vect2(this.x + vect.x, this.y + vect.y);
	}

	static SubBy(vect1, vect2) {
		return new Vect2(vect1.x - vect2.x, vect1.y - vect2.y);
	}

	subBy(vect) {
		return new Vect2(this.x - vect.x, this.y - vect.y);
	}

	add(vect) {
		this.x += vect.x;
		this.y += vect.y;
		return this;
	}
	sub(vect) {
		this.x -= vect.x;
		this.y -= vect.y;
		return this;
	}

	set(vect) {
		this.x = vect.x;
		this.y = vect.y;
		return this;
	}

	addX(vect) {
		this.x += vect.x;
	}

	addY(vect) {
		this.y += vect.y;
	}

	subX(vect) {
		this.x -= vect.x;
	}
	subY(vect) {
		this.y -= vect.y;
	}

	div(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this;
	}
	divBy(vect, scalar) {
		return new Vect2(vect.x / scalar, vect.y / scalar);
	}

	multBy(scalar) {
		return new Vect2(this.x * scalar, this.y * scalar);
	}
	mult(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	setX(vect) {
		this.x = vect.x;
	}
	setY(vect) {
		this.y = vect.y;
	}

	clone() {
		return new Vect2(this.x, this.y);
	}
}
