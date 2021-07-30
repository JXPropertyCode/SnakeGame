import { useEffect, useState } from "react";
import RestartPopup from "./RestartPopup";
import "./Board.css";

const Board = () => {
	// starting place of the snake
	const startRow = 0;
	const startCol = 0;

	const gridWidth = 5;
	const gridHeight = 5;
	const pixelWidth = 10;
	const pixelHeight = 10;
	const size = gridWidth * pixelWidth;
	const [grid, setGrid] = useState([]);

	// the direction of the interval
	const [direction, setDirection] = useState("");

	// starting place
	const [snakeCells, setSnakeCells] = useState([[startRow, startCol]]);
	// const [isOutOfBound, setIsOutOfBound] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);

	const isOutOfBound = (head, grid) => {
		// console.log("IsOutOfBound Grid:", grid)

		if (
			head[0] < 0 ||
			head[0] >= gridHeight ||
			head[1] < 0 ||
			head[1] >= gridWidth
		) {
			console.log("WENT OUT OF BOUNDS")
			return true;
		}

		if (grid[head[0]][head[1]] === 1) {
			console.log("THE SNAKE JUST ATE ITSELF");
			return true;
		}

		return false;
	};

	useEffect(() => {
		// if direction is empty, it won't run further or else the snakeCells = [[0,0], [0,0]]
		// if isGameOver, then it won't keep running any direction
		if (isGameOver || direction === "") return;
		const head = [...snakeCells[snakeCells.length - 1]];
		if (direction === "d") head[1] += 1;
		if (direction === "s") head[0] += 1;
		if (direction === "w") head[0] -= 1;
		if (direction === "a") head[1] -= 1;

		if (isOutOfBound(head, grid)) {
			// console.log("This is Out of Bounds");
			setIsGameOver(true);
		} else {
			// prevents the snakeCells from getting larger since it has not eaten anything
			setSnakeCells([head])
			
			// setSnakeCells([...snakeCells, head]);
		}
	}, [direction]);

	// create the initial grid. Only runs when the program first starts
	useEffect(() => {
		// console.log("useEffect activated");
		// console.log("Initializing Grid");
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

	// to track keyboard input, if the window pops up, it would ignore it
	// not sure if adding the dependency would affect other parts of the code
	useEffect(() => {
		console.log("useEffect activated");
		console.log("Listening to KeyDown:", !isGameOver);
		if (!isGameOver) {
			window.addEventListener("keydown", (e) => setDirection(e.key));
		} else {
			window.removeEventListener("keydown", (e) => setDirection(e.key));
		}

		return () => {
			window.removeEventListener("keydown", (e) => setDirection(e.key));
		};
	}, [isGameOver]);

	// detects the changes of snakecells
	useEffect(() => {
		console.log("useEffect activated");
		if (isGameOver === false) {
			// console.log("Able to keep moving");
			// setGrid((grid) => {
			setGrid(() => {
				// console.log("snakeCells:", snakeCells);
				// for (let snakeCell of snakeCells) {
				// 	grid[snakeCell[0]][snakeCell[1]] = 1;
				// }
				// console.log("grid:", grid);
				// return [...grid];

				let dummy = []

				for (let i = 0; i < gridWidth; i++) {
					let row = [];
					for (let k = 0; k < gridHeight; k++) {
						row.push(0);
					}
					dummy.push(row);
				}

				for (let snakeCell of snakeCells) {
					dummy[snakeCell[0]][snakeCell[1]] = 1;
				}

				console.log(dummy)
				return dummy

			});
		}
	}, [isGameOver, snakeCells]);

	// resets the entire grid
	const reset = () => {
		console.log("Reset the Grid");
		let dummy = [];
		for (let i = 0; i < gridWidth; i++) {
			let row = [];
			for (let k = 0; k < gridHeight; k++) {
				row.push(0);
			}
			dummy.push(row);
		}
		// since the snakeCell is an array within an array
		const snakeHead = snakeCells[0];
		// starting place
		dummy[snakeHead[0]][snakeHead[1]] = 1;

		// make the snakeCell reset
		setSnakeCells([[startRow, startCol]]);
		// give the state grid a new grid
		setGrid(dummy);
		setIsGameOver(false);
		setDirection("");
	};

	if (isGameOver) return <RestartPopup action={reset} />;

	return (
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
