import React from 'react';
import Editor from './editor/Editor';
import Game from '../game/game'
import Towers from './Towers'
let game;

let cols = 10;
let rows = 10;
const tilesize = 50;

let gameWidth = cols * tilesize;
let gameHeight = rows * tilesize;

function init(canvas) {
	canvas.width = gameWidth
	canvas.height = gameHeight

	game = new Game(canvas,gameWidth,gameHeight,cols,rows,tilesize)
}

class Time {
	constructor() {
		this.delta = null;
		this.totalDelta = null;
		this.lastFrameTime = null;
	}
	getTime() {
		if (!this.lastFrameTime) {
			this.lastFrameTime = performance.now();
			this.totalDelta = 0;
			return;
		}

		this.delta = (performance.now() - this.lastFrameTime) / 1000;
		this.lastFrameTime = performance.now();
		this.totalDelta += this.delta;

		return this.delta
	}
}


export default function Canvas() {
	const [_, setTool] = React.useState('');
	const [__, setTower] = React.useState('');

	const canvasRef = React.useRef(null)


    const handleClick = (e) => {
        console.log(e.target.value);
		setTool(e.target.value)
		game.setTool(e.target.value);
		game.setAction(e.target.value)

		// game.setSelectedTower


	}
	
	const handleTowerClick = (e) => {
		setTower(e.target.value)
		game.setSelectedTower(e.target.value);
		game.setAction('buy')
	}

    React.useEffect(() => {
		const time = new Time();
		let anId;
        const animate = () => {
			game.update(time.getTime())
			

            anId = requestAnimationFrame(animate)
        }

        init(canvasRef.current)
        animate();

    },[])

	return (<>
		<canvas id='canvas' ref={canvasRef}></canvas>
		<Editor  handleClick={handleClick}/>
		<Towers handleClick={handleTowerClick} />
	</>
	)
}