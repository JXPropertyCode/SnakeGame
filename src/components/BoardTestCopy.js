import { useEffect, useState, useRef } from "react";
import RestartPopup from "./RestartPopup";
import "./Board.css";
import { findAllByDisplayValue } from "@testing-library/react";

const BoardTestCopy = () => {
	const gridWidth = 2;
	const gridHeight = 2;
	const pixelWidth = 10;
	const pixelHeight = 10;
	const size = gridWidth * pixelWidth;

	const startRow = 0;
	const startCol = 0;

	const [snakeCells, setSnakeCells] = useState([]);
	const [foodCell, setFoodCell] = useState([]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [grid, setGrid] = useState([]);
	const [direction, setDirection] = useState("");

	// Function to generate random number for foodCell
	const randomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// detect for avaiable spaces
	const avaiableSpace = (
		dummy,
		currRow,
		currCol,
		possibleRow,
		possibleCol
	) => {
		if (currRow === possibleRow && currCol === possibleCol) {
			return false;
		} else if (dummy[possibleRow][possibleCol] === 0) {
			return true;
		}
		return false;
	};

	const detectRelocation = (dummy, startRow, startCol) => {
		let randomRow = randomNumber(0, gridWidth - 1);
		let randomCol = randomNumber(0, gridHeight - 1);
		while (
			avaiableSpace(dummy, startRow, startCol, randomRow, randomCol) ===
			false
		) {
			console.log("Recalculating Avaiable Space");
			randomRow = randomNumber(0, gridWidth - 1);
			randomCol = randomNumber(0, gridHeight - 1);

			console.log("new randomRow:", randomRow);
			console.log("new randomCol:", randomCol);
		}
		return [randomRow, randomCol];
	};

	// initialization
	useEffect(() => {
		console.log("Initialization");
		let dummy = [];
		for (let i = 0; i < gridHeight; i++) {
			let row = [];
			for (let k = 0; k < gridWidth; k++) {
				row.push(0);
			}
			dummy.push(row);
		}
		console.log("dummy:", dummy);

		// start of the snakeHead
		dummy[startRow][startCol] = 1;

		let foodCoordinate = detectRelocation(dummy, startRow, startCol);
		console.log("initialization foodCoordinate:", foodCoordinate);

		dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
		console.log("foodCell:", [foodCoordinate[0], foodCoordinate[1]]);
		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		setGrid(dummy);
	}, []);

	const onKeyDown = (e) => {
		console.log("Key Detected:", e.key);
		setDirection(e.key);
		return null;
	};

	useEffect(() => {
		// console.log("useEffect activated");
		console.log("useEffect Listening to KeyDown:", !isGameOver);
		if (!isGameOver) {
			console.log("Actively Listening to KeyDowns");
			window.addEventListener("keydown", onKeyDown);
		} else {
			console.log("NOT Listening to KeyDowns");
			window.removeEventListener("keydown", onKeyDown);
			// clearInterval(directionInterval.current);
		}

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			// clearInterval(directionInterval.current);
		};
	}, [isGameOver]);

	const collision = (head, grid) => {
		console.log("Detecting Collision...");
		let currRow = head[0];
		let currCol = head[1];

		// going out of bounds
		if (
			currRow < 0 ||
			currRow >= gridHeight ||
			currCol < 0 ||
			currCol >= gridWidth
		) {
			console.log("Collision Detected: Boundaries");
			return true;
		}

		// eating itself
		if (grid[currRow][currCol] === 1) {
			console.log("Collision Detected: Self");
			return true;
		}

		if (grid[currRow][currCol] === 0) {
			console.log("No Collision Detected");
			return false;
		}

		// if (grid[currRow][currCol] === 2) {
		// 	console.log("Collision Detected: Head and Food");

		// 	let foodCoordinate = detectRelocation(grid, currRow, currCol);
		// 	console.log("initialization foodCoordinate:", foodCoordinate);
		// 	grid[foodCoordinate[0]][foodCoordinate[1]] = 2;
		// }


		return false;
	};

	// detects direction useState() changes
	useEffect(() => {
		if (snakeCells.length === 0) {
			console.log("SnakeCells is Empty");
			return;
		}

		if (direction === "") {
			console.log("No Direction Assigned Yet...");
			return;
		}

		const head = [...snakeCells[snakeCells.length - 1]];

		console.log("head:", head);
		console.log("snakeCells:", snakeCells);

		console.log("Recreating the Grid...");
		if (direction === "d") head[1] += 1;
		if (direction === "s") head[0] += 1;
		if (direction === "w") head[0] -= 1;
		if (direction === "a") head[1] -= 1;

		if (collision(head, grid)) {
			// console.log("Collision Detected")
			setIsGameOver(true);
			return;
		}

		let dummy = [];
		for (let i = 0; i < gridWidth; i++) {
			let row = [];
			for (let k = 0; k < gridHeight; k++) {
				row.push(0);
			}
			dummy.push(row);
		}

		if (foodCell[0] === head[0] && foodCell[1] === head[1]) {
			console.log("Collision Detected: FoodCell and Head");
			console.log("FoodCell current position:", foodCell)
			let foodCoordinate = detectRelocation(dummy, head[0], head[1]);
			console.log("initialization foodCoordinate:", foodCoordinate);
			dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
			setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		} else {
			console.log("Collision NOT Detected")
			dummy[foodCell[0]][foodCell[1]] = 2;
		}

		dummy[head[0]][head[1]] = 1;
		console.log("moved head:", head);
		console.log("renewed dummy:", dummy);
		setGrid(dummy);
		setSnakeCells([head]);
	}, [direction]);

	// resets the entire grid
	const reset = () => {
		console.log("Reset the Grid");
		let dummy = [];
		for (let i = 0; i < gridHeight; i++) {
			let row = [];
			for (let k = 0; k < gridWidth; k++) {
				row.push(0);
			}
			dummy.push(row);
		}
		// starting place
		dummy[startRow][startCol] = 1;

		let foodCoordinate = detectRelocation(dummy, startRow, startCol);
		console.log("initialization foodCoordinate:", foodCoordinate);
		dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
		
		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		setGrid(dummy);
		setIsGameOver(false);
		setDirection("");
	};

	if (isGameOver) return <RestartPopup action={reset} />;
	console.log("Current Direction:", direction);
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
												(grid[i][k] === 0 && "white") ||
												(grid[i][k] === 2 &&
													"yellow") ||
												(grid[i][k] === 1 && "green"),

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

export default BoardTestCopy;
