import collision from "./collision/collision";
import { COLORS } from "./game";
import Vect2 from "./Vect2";

class GridNode {
	constructor(x, y, col, row, tilesize, color) {
		this.x = x;
		this.y = y;
		this.col = col;
		this.row = row;
		this.tilesize = tilesize;
		this.color = color;
		this.tower = false;
		this.wall = true;
		this.highlight = false;
		this.towerId = null;
		this.neighbours = [];
	}

	get middle() {
		return new Vect2(this.x + this.tilesize / 2, this.y + this.tilesize / 2);
	}

	equals(otherNode) {
		if (this.x === otherNode.x && this.y === otherNode.y) return true;
		return false;
	}

	addDiagNeighbours(maxCols, maxRows, getNode) {
		if (this.row - 1 >= 0 && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row - 1));
		if (this.row - 1 >= 0 && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row - 1));
		if (this.row + 1 < maxRows && this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row + 1));
		if (this.row + 1 < maxRows && this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row + 1));
	}

	addNeighbours(maxCols, maxRows, getNode) {
		// sides
		if (this.col + 1 < maxCols) this.neighbours.push(getNode(this.col + 1, this.row));
		if (this.col - 1 >= 0) this.neighbours.push(getNode(this.col - 1, this.row));
		if (this.row + 1 < maxRows) this.neighbours.push(getNode(this.col, this.row + 1));
		if (this.row - 1 >= 0) this.neighbours.push(getNode(this.col, this.row - 1));
		// diag
		// this.addDiagNeighbours(maxCols, maxRows, getNode);
	}

	addTower(tower) {
		this.towerId = tower.id;
	}

	removeTower(towers, tower) {
		if (tower.id === this.towerId) {
			// this.towerIndex;
			this.tower = false;
			towers.remove(tower.id);
		}
	}

	changeColor(color) {
		this.color = color;
	}

	draw(Draw, mouse) {
		if (collision.pointTile(mouse, this) && mouse.x !== null && mouse.y !== null) {
			this.highlight = true;
		} else this.highlight = false;
		Draw.setStroke(this.color);
		Draw.setFill(this.color);
		Draw.drawRect(this.x, this.y, this.tilesize, this.tilesize, true);
		if (this.highlight) {
			Draw.setFill(COLORS.HIGHLIGHT);
			Draw.drawRect(this.x, this.y, this.tilesize, this.tilesize, true);
		}

		Draw.setStroke("black");
		Draw.drawRect(this.x, this.y, this.tilesize, this.tilesize);
	}
}

export default class Grid {
	#grid = [];
	constructor(width, height, cols, rows, tilesize) {
		this.width = width;
		this.height = height;
		this.tilesize = tilesize;
		this.cols = cols;
		this.rows = rows;
		// console.log(this.cols, this.rows);
		// console.log(this.tilesize);
		this.generate();
		// console.log(this.grid.length);
	}

	get grid() {
		return this.#grid;
	}

	generate() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.#grid.push(
					new GridNode(col * this.tilesize, row * this.tilesize, col, row, this.tilesize, COLORS.WALL)
				);
			}
		}

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.getTile(col, row).addNeighbours(this.cols, this.rows, this.getTile.bind(this));
			}
		}
	}

	reset() {
		this.#grid.length = 0;
		this.generate();
	}

	getTileXY(x, y) {
		let col = Math.floor(x / this.tilesize);
		let row = Math.floor(y / this.tilesize);
		return this.#grid[row * this.cols + col];
	}

	getTile(col, row) {
		return this.#grid[row * this.cols + col];
	}
}
