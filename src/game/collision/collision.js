export default {
	circleCircle: (c1, c2) => {
		let dx = c1.x + c1.radius - (c2.x + c2.radius);
		let dy = c1.y + c1.radius - (c2.y + c2.radius);
		let distance = Math.sqrt(dx * dx + dy * dy);
		console.log(c1, c2);

		if (distance < c1.radius + c2.radius) {
			return true;
		}
	},

	pointCircle: (point, circle) => {
		let distX = point.x - circle.x;
		let distY = point.y - circle.y;
		let distance = Math.sqrt(distX * distX + distY * distY);
		if (distance <= circle.radius) {
			return true;
		}
	},

	pointRect: (point, rect) => {
		if (
			point.x >= rect.x &&
			point.y >= rect.y &&
			point.x <= rect.x + rect.width &&
			point.y <= rect.y + rect.height
		) {
			return true;
		}
	},
	pointTile: (point, tile) => {
		if (
			point.x >= tile.x &&
			point.y >= tile.y &&
			point.x <= tile.x + tile.tilesize &&
			point.y <= tile.y + tile.tilesize
		) {
			return true;
		}
	},
};
