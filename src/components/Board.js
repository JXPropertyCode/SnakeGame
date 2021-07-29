import { useEffect, useRef, useState } from "react";
import RestartPopup from "./RestartPopup";
import './Board.css'

const Board = () => {
	const gridWidth = 5;
	const gridHeight = 5;
	const pixelWidth = 10;
	const pixelHeight = 10;
	const size = gridWidth * pixelWidth;
	const [grid, setGrid] = useState([]);
	// starting place
	const [snakeCells, setSnakeCells] = useState([[0, 0]]);
	const [isOutOfBound, setIsOutOfBound] = useState(false);

	// create the initial grid
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
	// const detectOutOfBounds = (position) => {
	// 	console.log("Out of Bound Detected");
	// 	console.log("position:", position);
	// 	setIsOutOfBound(true);

	// 	return;
	// };

	// to assign actions to keyboard input
	const onKeyDown = (e) => {
		if (e.key === "d") {
			console.log(e.key);

			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				if (head[1] >= gridWidth - 1) {
					console.log("head[1] >= gridWidth-1");
					setIsOutOfBound(true);
					return [[0, 0]];
				} else {
					head[1] += 1;
					console.log("head:", head);
					return [...cells, head];
				}
			});
		}
		if (e.key === "a") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[1] -= 1;
				return [...cells, head];
			});
		}
		if (e.key === "w") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				// detectOutOfBounds(head);
				head[0] -= 1;
				// detectOutOfBounds(head);
				return [...cells, head];
			});
		}
		if (e.key === "s") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				// detectOutOfBounds(head);
				head[0] += 1;
				// detectOutOfBounds(head);
				return [...cells, head];
			});
		}
	};

	// to track keyboard input, if the window pops up, it would ignore it
	// not sure if adding the dependency would affect other parts of the code
	useEffect(() => {
		console.log("Listening to KeyDown:", isOutOfBound)
		if (!isOutOfBound) {
			window.addEventListener("keydown", onKeyDown);
			return () => {
				window.removeEventListener("keydown", onKeyDown);
			};
		}
	}, [isOutOfBound]);

	// detects the changes of snakecells
	useEffect(() => {
		console.log("snakeCells:", snakeCells);
		if (isOutOfBound === false) {
			setGrid((grid) => {
				console.log("snakeCells:", snakeCells);
				for (let snakeCell of snakeCells) {
					grid[snakeCell[0]][snakeCell[1]] = 1;
				}
				console.log("grid:", grid);
				return [...grid];
			});
		}
	}, [snakeCells]);

	return isOutOfBound ? (
		<RestartPopup
			isOutOfBound={isOutOfBound}
			setIsOutOfBound={setIsOutOfBound}
		></RestartPopup>
	) : (
		<div className="center">
			<p>Snake Board</p>
			<div style={{ width: size, height: size, background: "red" }}>
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
													? "white"
													: "green",
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
