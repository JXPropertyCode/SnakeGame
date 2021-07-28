import { useEffect, useRef, useState } from "react";

const Board = () => {

	const gridWidth = 20
	const gridHeight = 20

	const pixelWidth = 10
	const pixelHeight = 10

	const size = gridWidth*pixelWidth


	const [grid, setGrid] = useState([]);

	// starting place
	const [snakeCells, setSnakeCells] = useState([[0, 0]]);

	useEffect(() => {
		let dummy = [];
		for (let i = 0; i < gridWidth; i++) {
			let row = [];
			for (let k = 0; k < gridHeight; k++) {
				row.push(0);
			}
			dummy.push(row);
		}
		const snakeHead = snakeCells[0];
		// starting place
		dummy[snakeHead[0]][snakeHead[1]] = 1;
		setGrid(dummy);
	}, []);

	// detecting out of bounds
	const detectOutOfBounds = (position) => {
		let row = position[0];
		let col = position[1];
		console.log("position:", position)
		console.log("grid:", grid)

		if (row < 0 || row > gridHeight-1) {
			console.log("Out of Bounds ROW axis");
			return;
		}

		if (col < 0 || col > gridWidth-1) {
			console.log("Out of Bounds COL axis");
			return;
		}
	};

	// to track keyboard input
	const onKeyDown = (e) => {
		if (e.key === "d") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[1] += 1;
				detectOutOfBounds(head);
				return [...cells, head];
			});
		}
		if (e.key === "a") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[1] -= 1;
				detectOutOfBounds(head);
				return [...cells, head];
			});
		}
		if (e.key === "w") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[0] -= 1;
				detectOutOfBounds(head);
				return [...cells, head];
			});
		}
		if (e.key === "s") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[0] += 1;
				detectOutOfBounds(head);
				return [...cells, head];
			});
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	useEffect(() => {
		setGrid((grid) => {
			console.log("snakeCells:", snakeCells);
			for (let snakeCell of snakeCells) {
				grid[snakeCell[0]][snakeCell[1]] = 1;
			}
			console.log("grid:", grid)
			return [...grid];
		});
	}, [snakeCells]);

	return (
		<div>
			<p>Snake Board</p>
			<div
				style={{ width: size, height: size, background: "green" }}
			>
				{grid.map((row, i) => {
					return (
						<div
							key={i + "row"}
							style={{ display: "flex", flexDirection: "row" }}
						>
							{row.map((v, k) => {
								return (
									<div
										key={k + "cell"}
										style={{
											width: pixelWidth,
											height: pixelHeight,
											background:
												grid[i][k] === 0
													? "blue"
													: "red",
											borderStyle: "solid",
											borderWidth: "thin",
											borderColor: "black",
										}}
									></div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Board;
