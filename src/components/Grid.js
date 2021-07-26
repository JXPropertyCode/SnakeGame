import { useEffect, useRef, useState } from "react";

let positionX = 0;
let positionY = 0;
let canvas = {};
let cw = 0;
let ch = 0;
let bw = 100;
let bh = 100;

function onKeyPress(e) {
	let dx = 50;
	let dy = 15;
	if (e.keyCode === 87) {
		console.log("w(87) up");
		positionY = Math.max(0, positionY - dy);
	} else if (e.keyCode === 83) {
		console.log("s(83) down");
		positionY = Math.min(positionY + dy, ch - bh);
	} else if (e.keyCode === 68) {
		console.log("d(68) right");
		positionX = Math.min(positionX + dx, cw - bw);
	} else if (e.keyCode === 65) {
		console.log("a(65) left");
		positionX = Math.max(0, positionX - dx);
	}
	// draw();
}

const Grid = () => {
	const canvasWidth = 500;
	const canvasHeight = 500;

	const canvasRef = useRef(null);

	window.addEventListener("keydown", onKeyPress, true);

	return (
		<div>
			<p>Insert Grid</p>
			<canvas
				width={canvasWidth}
				height={canvasHeight}
				style={{ border: "1px solid black" }}
				ref={canvasRef}
			></canvas>
		</div>
	);
};

export default Grid;
