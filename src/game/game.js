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

const TOWER_NAMES = {
	standard: 0,
};

// { cost, damage, pierce, range, fireRate }

const TOWERS = [
	{
		cost: 150,
		dmg: 1,
		pierce: 1,
		range: 150,
		fireRate: 2, // per second
	},
];

export default class Game {
	#tool = null;
	#selectedTower = null;
	#action = null;
	#running = false;
	#money = 500;
	#ACTIONS = new Map();

	constructor(canvas, width, height, cols, rows, tilesize) {
		// console.log(this.#towers);
		this.cols = cols;
		this.rows = rows;
		this.tilesize = tilesize;
		this.width = width;
		this.height = height;
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
		this.lives = 100;
		this.#ACTIONS.set("buy", 0);
		this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
		this.canvas.addEventListener("mousemove", this.setMousePos.bind(this));
	}

	setAction(key) {
		const validAction = this.#ACTIONS.get(key);
		if (validAction !== null) {
			this.#action = validAction;
		}
	}

	setSelectedTower(value) {
		this.#selectedTower = value;
	}

	setTool(value) {
		this.#tool = value;

		if (value === "start-game") {
			this.startGame();
		} else if (value === "build-path") {
			this.buildPath();
		}
	}

	addMoney(num) {
		this.#money += num;
	}

	subtractLives(num) {
		this.lives -= num;
	}

	startGame() {
		this.#running = true;
		this.buildPath();
		// this.enemies.setStart(this.start);
		this.enemies.init(this.start, this.path, this.subtractLives.bind(this));
		this.enemies.spawnEnemy(this.path);
		this.enemies.startNewWave();
		// let pos = new Vect2(this.start.x + this.tilesize / 2, this.start.y + this.tilesize / 2);

		// const enemy = new Enemy(pos.x, pos.y, this.tilesize / 2, 10, "red");
		// enemy.getNextWaypoint(this.path);
		// this.enemies.add(enemy);
	}

	placeWall(tile) {
		if (tile.tower) this.removeTower(tile);
		tile.tower = false;
		tile.wall = true;
		tile.changeColor(COLORS.WALL);
	}

	buildPath() {
		const path = this.pathfind.find_path(this.start, this.end);
		path.shift();
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

	spawnTower(tile, tower) {
		let range = tile.tilesize * 3;
		let fireRate = 2;

		// id,
		// 	{ cost, damage, pierce, range, fireRate },
		// x, y,
		// width, height,

		const spawnedTower = new Tower(this.towers.size, tower, tile.x, tile.y, tile.tilesize, tile.tilesize);
		spawnedTower.init(this.addMoney.bind(this));
		this.towers.add(spawnedTower);

		return spawnedTower;
	}

	canBuyTower(costOfTower) {
		console.log(this.#money, costOfTower);
		return this.#money >= costOfTower;
	}

	buyTower(costOfTower) {
		// console.log("cost of tower: ", cost);
		this.#money -= costOfTower;
	}

	placeTower(tile, towerType) {
		// console.log(tile, towerType);
		let type = TOWER_NAMES[towerType];
		const towerInfo = TOWERS[type];
		console.log(towerInfo);
		if (this.canBuyTower(towerInfo.cost)) {
			this.buyTower(towerInfo.cost);
			const temp = this.spawnTower(tile, towerInfo);
			tile.wall = false;
			tile.tower = true;
			tile.addTower(temp);
			tile.changeColor(COLORS.TOWER);
		} else {
			console.log("Not Enough Funds: cost: %s, money: %s", towerInfo.cost, this.#money);
		}
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

	setMousePos(e) {
		let rect = this.canvas.getBoundingClientRect();
		this.mouse.x = e.clientX - rect.left;
		this.mouse.y = e.clientY - rect.top;
	}

	onMouseDown(e) {
		this.setMousePos(e);
		this.interact();
	}

	interact() {
		//* interacts with tiles based on tool type
		const tile = this.grid.getTileXY(this.mouse.x, this.mouse.y);
		if (this.#action === this.#ACTIONS.get("buy")) {
			console.log("action: ", this.#action);

			this.placeTower(tile, this.#selectedTower);
			return;
		}

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
				this.placeTower(tile, this.#selectedTower, 150);
				break;
			case "remove-tower":
				this.removeTower(tile, 150);
				tile.wall = true;
				break;

			default:
				break;
		}
	}

	drawPath(path) {
		this.Draw.setFill("lightblue");

		for (let i = 0; i < path.length; i++) {
			let node = path[i];

			this.Draw.drawRect(node.x, node.y, node.tilesize, node.tilesize, true);
		}
	}

	renderUI() {
		const moneyTag = document.getElementById("money");
		moneyTag.innerText = this.#money;
		this.Draw.setFont("20px Arial");
		this.Draw.drawText(`Lives: ${this.lives}`, "black", 20, this.height - 20);
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

		if (this.#running) {
			// console.log();
			this.towers.update(this.Draw, this.mouse, this.enemies.enemies, delta);
			this.enemies.update(delta);
		}
	}
}
