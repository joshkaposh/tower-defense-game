import PriorityQueue from "../PriorityQueue";

export function distance(a, b) {
	let x = a.x - b.x;
	let y = a.y - b.y;
	return Math.sqrt(x * x + y * y);
}

class Path {
	#path = new Map();
	#rebuilt_path = [];

	get rebuiltPath() {
		return this.#rebuilt_path;
	}

	get path() {
		return this.#path;
	}

	add(parent, node) {
		this.#path.set(node, parent);
	}

	rebuild(currentNode) {
		this.#rebuilt_path.length = 0;
		this.#rebuilt_path.push(currentNode);

		while (this.#path.has(currentNode)) {
			currentNode = this.#path.get(currentNode);
			this.#rebuilt_path.push(currentNode);
		}
		return this.#rebuilt_path.reverse();
	}
}

export default class A_Star {
	constructor(heuristic) {
		this.heuristic = heuristic;
		this.openSet = new PriorityQueue(Infinity);
		this.closedSet = new Map();
		this.path = new Path();
		this.costs = {
			g: new Map(),
			f: new Map(),
		};

		this.finished = false;
		this.failure = false;
	}

	start_new_path(start, end) {
		// console.log(start, end);
		this.openSet.clear();
		this.closedSet.clear();
		this.path = new Path();
		this.costs.f.clear();
		this.costs.g.clear();

		this.costs.g.set(start, 0);
		this.costs.f.set(start, this.heuristic(start, end));
		this.openSet.add(start, this.costs.f.get(start));
	}

	find_path(start, goal) {
		this.start_new_path(start, goal);

		let current = 0;
		const { g, f } = this.costs;
		//! begin pathfinding
		while (!this.openSet.isEmpty) {
			//! keep going
			current = this.openSet.peek();
			//! get node from openSet with lowest fCost
			if (current.equals(goal)) {
				//! reached the goal
				// console.log("FINISHED!!");
				this.finished = true;
				return this.path.rebuild(current);
			}

			this.openSet.remove();
			this.closedSet.set(current, current);

			let neighbours = current.neighbours;

			for (let i = 0; i < neighbours.length; i++) {
				let neighbour = neighbours[i];

				if (!this.closedSet.has(neighbour) && !neighbour.wall) {
					//! ignore if neighbour was already evaluated
					let tempG = g.get(current) + distance(current, neighbour);

					if (!g.has(neighbour) || tempG < g.get(neighbour)) {
						//! best recorded gCost so far;
						g.set(neighbour, tempG);
						f.set(neighbour, this.heuristic(neighbour, goal) + g.get(neighbour));
						this.path.add(current, neighbour);
					}
					if (!this.openSet.contains(neighbour)) {
						this.openSet.add(neighbour, f.get(neighbour));
					}
				}
			}
		}
		//! no solution
		return false;
	}
}
