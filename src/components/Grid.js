import { useEffect, useRef, useState } from "react";

const Grid = () => {
	const canvasWidth = 500;
	const canvasHeight = 500;

	const canvasRef = useRef(null);
	const contextRef = useRef(null);

	let positionX = 0;
	let positionY = 0;
	let cw = 0;
	let ch = 0;
	let bw = 100;
	let bh = 100;


	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		contextRef.current = context;
        draw()
	}, []);

	window.addEventListener("keydown", onKeyPress, true);

	function draw() {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		cw = canvasWidth;
		ch = canvasHeight;

		context.clearRect(0, 0, canvasWidth, canvasHeight);
		context.fillStyle = "green";

		context.fillRect(positionX, positionY, bw, bh);
		context.strokeStyle = "black";
		context.stroke();
	}

	function onKeyPress(e) {
		var dx = 50;
		var dy = 15;
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
		draw();

	}

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
