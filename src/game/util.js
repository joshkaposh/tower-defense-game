export const randIntFromRange = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

export const distance = (p1X, p1Y, p2X, p2Y) => {
	return Math.sqrt(Math.exp(p2X - p1X) + Math.exp(p2Y - p1Y));
};

export const calcAtanAngle = (y, x) => {
	return Math.atan2(y, x);
};

export const hypotOfPoint = (x, y) => Math.sqrt(x * x + y * y);

export const cosOfX = (len, angle) => len * Math.cos(angle);
export const sinOfY = (len, angle) => len * Math.sin(angle);

export const pointFromPolar = (angle, len) => {
	return;
};

export const polarFromPoint = (x, y) => {
	let angle = Math.atan2(y, x);
	let length = hypotOfPoint(x, y);
	let dx = length * Math.cos(angle);
	let dy = length * Math.sin(angle);
	return {
		angle,
		length,
		dx,
		dy,
	};
};

export const clamp = (value, min, max) => {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}

	return value;
};

export const lerp = (x1, x2, amount) => {
	return x1 + (x2 - x1) * amount;
};

export default {
	lerp,
	clamp,
	cosOfX,
	sinOfY,
	randIntFromRange,
	distance,
	calcAtanAngle,
	hypotOfPoint,
	polarFromPoint,
};
