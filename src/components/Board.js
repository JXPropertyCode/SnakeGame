import { useEffect, useState } from "react";
import RestartPopup from "./RestartPopup";
import "./Board.css";

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

	const [isRestart, setIsRestart] = useState(false);

	// create the initial grid. Only runs when the program first starts
	useEffect(() => {
		console.log("useEffect activated");
		console.log("Initializing Grid");
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

	// to assign actions to keyboard input
	const onKeyDown = (e) => {
		if (e.key === "d") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];

				// detects out of bounds for the right side of the board
				if (head[1] >= gridWidth - 1) {
					console.log("head[1] >= gridWidth-1");
					setIsOutOfBound(true);
					setIsRestart(true);

					return [...cells];
				} else {
					head[1] += 1;
					console.log("head:", head);
					return [...cells, head];
				}
			});
		}
	};

	// to track keyboard input, if the window pops up, it would ignore it
	// not sure if adding the dependency would affect other parts of the code
	useEffect(() => {
		console.log("useEffect activated");
		console.log("Listening to KeyDown:", !isOutOfBound);
		if (!isOutOfBound) {
			window.addEventListener("keydown", onKeyDown);
			return () => {
				window.removeEventListener("keydown", onKeyDown);
			};
		}
	}, [isOutOfBound]);

	// detects the changes of snakecells
	useEffect(() => {
		console.log("useEffect activated");
		if (isOutOfBound === false) {
			console.log("Able to keep moving");
			setGrid((grid) => {
				console.log("snakeCells:", snakeCells);
				for (let snakeCell of snakeCells) {
					grid[snakeCell[0]][snakeCell[1]] = 1;
				}
				console.log("grid:", grid);
				return [...grid];
			});
		}

		// reset the grid
		if (isRestart === true) {
			console.log("Out of Bounds... Restarting the Grid");
			setGrid((grid) => {
				console.log("snakeCells:", snakeCells);
				for (let snakeCell of snakeCells) {
					grid[snakeCell[0]][snakeCell[1]] = 0;
				}
				console.log("grid:", grid);
				grid[0][0] = 1;
				setSnakeCells([[0, 0]]);

				return [...grid];
			});
			setIsRestart(false);
		}
	}, [snakeCells]);

	return isOutOfBound ? (
		<RestartPopup setIsOutOfBound={setIsOutOfBound} />
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
