// tower
// enemy
// grid with start and end
// lives
// money
import util from "./util";
import A_Star, { distance } from "./pathfinder/A_Star";
import Drawer from "../CanvasDrawer";
import Grid from "./Grid";
import Enemies from "./enemies/Enemies";
import Enemy from "./enemies/Enemy";
import Towers from "./towers/Towers";
import Tower from "./towers/Tower";

import Vect2 from "./Vect2";
export const COLORS = {
	WALL: "grey",
	START_OF_PATH: "rgb(0,255,0)",
	END_OF_PATH: "rgb(0,50,0)",
	PATH: "green",
	TOWER: "#964B00",
	HIGHLIGHT: "rgba(255,255,255,0.4)",
};

export default class Game {
	#tool = null;
	#money = 500;

	constructor(canvas, width, height, cols, rows, tilesize) {
		// console.log(this.#towers);
		this.cols = cols;
		this.rows = rows;
		this.tilesize = tilesize;
		this.mouse = new Vect2(null, null);
		this.Draw = new Drawer(canvas.getContext("2d"));
		this.grid = new Grid(width, height, this.cols, this.rows, tilesize);
		this.pathfind = new A_Star(distance);
		this.towers = new Towers();
		this.enemies = new Enemies();

		this.canvas = canvas;
		this.start = null;
		this.end = null;
		this.path = null;
		this.waveCounter = 0;
		this.canvas.addEventListener("mousedown", this.trackMouse.bind(this));
		this.canvas.addEventListener("mousemove", this.followMouse.bind(this));
	}

	setTool(value) {
		this.#tool = value;

		if (value === "start-game") {
			this.startGame();
		}
	}

	startGame() {
		this.buildPath();
		let pos = new Vect2(this.start.x + this.tilesize / 2, this.start.y + this.tilesize / 2);
		this.enemies.add(new Enemy(pos.x, pos.y, this.tilesize / 2, 10, "red"));
	}

	placeWall(tile) {
		if (tile.tower) this.removeTower(tile);
		tile.tower = false;
		tile.wall = true;
		tile.changeColor(COLORS.WALL);
	}

	drawPath(path) {
		this.Draw.setFill("lightblue");

		for (let i = 0; i < path.length; i++) {
			let node = path[i];

			this.Draw.drawRect(node.x, node.y, node.tilesize, node.tilesize, true);
		}
	}

	buildPath() {
		const path = this.pathfind.find_path(this.start, this.end);
		this.path = path;
		// console.log(path);
	}

	placePath(tile) {
		if (tile.tower) this.removeTower(tile);
		tile.wall = false;
		tile.changeColor(COLORS.PATH);
	}
	placeStart(tile) {
		if (this.start) this.placeWall(this.start);
		if (tile.tower) this.removeTower(tile);
		tile.wall = false;
		tile.changeColor(COLORS.START_OF_PATH);
		this.start = tile;
	}

	placeEnd(tile) {
		if (this.end) this.placeWall(this.end);
		if (tile.tower) this.removeTower(tile);
		tile.wall = false;
		tile.changeColor(COLORS.END_OF_PATH);
		this.end = tile;
	}

	placeTower(tile, towerCost) {
		if (this.#money < towerCost) return;
		this.#money -= towerCost;

		// this.buyTower();
		const tower = new Tower(
			this.towers.size,
			towerCost,
			tile.x,
			tile.y,
			tile.tilesize,
			tile.tilesize,
			tile.tilesize * 3,
			0.33
		);
		tile.wall = false;
		tile.tower = true;
		tile.addTower(tower);
		tile.changeColor(COLORS.TOWER);
		this.towers.add(tower);
	}

	removeTower(tile, towerCost) {
		this.towers.remove(tile.towerId);
		tile.tower = false;
		this.#money += towerCost;

		this.placeWall(tile);
	}

	highlightTile(tile) {
		tile.highlight = true;
	}

	followMouse(e) {
		let rect = this.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
	}

	trackMouse(e) {
		let rect = this.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;

		this.interact();
		// console.log(this.mouse);
	}

	interact() {
		//* interacts with tiles based on tool type
		const tile = this.grid.getTileXY(this.mouse.x, this.mouse.y);
		switch (this.#tool) {
			case "build-path":
				console.log("hi");
				if (this.start && this.end) {
					console.log("building path");
					this.buildPath(this.start, this.end);
				}
				// if ()
				break;
			case "place-path":
				console.log("hi");
				this.placePath(tile);
				break;
			case "place-start":
				this.placeStart(tile);
				break;
			case "place-end":
				this.placeEnd(tile);
				break;
			case "place-wall":
				this.placeWall(tile);
				break;

			case "place-tower":
				this.placeTower(tile, 150);
				break;
			case "remove-tower":
				this.removeTower(tile, 150);
				tile.wall = true;
				break;

			default:
				break;
		}
	}

	renderUI() {
		const moneyTag = document.getElementById("money");
		moneyTag.innerText = this.#money;
	}

	render() {
		this.Draw.drawRect(0, 0, this.width, this.height);
		this.Draw.clear(0, 0, this.width, this.height);
		this.Draw.setWeight(1);

		for (let row = 0; row < this.grid.rows; row++) {
			for (let col = 0; col < this.grid.cols; col++) {
				const tile = this.grid.getTile(col, row);
				tile.draw(this.Draw, this.mouse);
			}
		}

		if (this.path) this.drawPath(this.path);

		// for (let i = 0; i < this.#towers.length; i++) {
		// this.#towers[i].draw(this.Draw, this.mouse);
		// }
		this.towers.render(this.Draw, this.mouse);
		this.enemies.render(this.Draw);
		this.renderUI();
	}
	update(delta) {
		this.render();
		// console.log(this.towers);
		this.towers.update(this.Draw, this.mouse, delta);
		this.enemies.update(this.path, delta);
		// this.towers.update(this.Draw, this.mouse, delta);
		// for (let i = 0; i < this.#towers.length; i++) {
		// 	this.#towers[i].update(this.Draw, this.mouse, delta);
		// }
	}
}
