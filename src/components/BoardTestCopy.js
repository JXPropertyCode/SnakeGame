import { useEffect, useState, useRef } from "react";
import RestartPopup from "./RestartPopup";
import "./Board.css";

const BoardTestCopy = () => {
	const gridWidth = 10;
	const gridHeight = 10;
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
		return Math.floor(Math.random() * (max - min) + min);
	};

	// initialization
	useEffect(() => {
		console.log("Initialization");
		let dummy = [];
		for (let i = 0; i < gridWidth; i++) {
			let row = [];
			for (let k = 0; k < gridHeight; k++) {
				row.push(0);
			}
			dummy.push(row);
		}
		console.log("dummy:", dummy);

		// start of the snakeHead
		dummy[startRow][startCol] = 1;

		// generating a random food
		let randomRow = randomNumber(startRow + 1, gridWidth - 1);
		let randomCol = randomNumber(startCol + 1, gridHeight - 1);
		dummy[randomRow][randomCol] = 2;

		setSnakeCells([[startRow, startCol]]);
		setFoodCell([randomRow, randomCol]);
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

		console.log("No Collision Detected");

		return false;
	};

	useEffect(() => {
		if (snakeCells.length === 0) {
			console.log("SnakeCells is Empty");
			return;
		}

        if (direction === '') {
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

		console.log("foodCell:", foodCell);

		dummy[head[0]][head[1]] = 1;
		dummy[foodCell[0]][foodCell[1]] = 2;
		console.log("moved head:", head);
		console.log("renewed dummy:", dummy);
		setGrid(dummy);
		setSnakeCells([head]);
	}, [direction]);

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
		// starting place
		dummy[startRow][startCol] = 1;

        let randomRow = randomNumber(startRow + 1, gridWidth - 1);
		let randomCol = randomNumber(startCol + 1, gridHeight - 1);
        dummy[randomRow][randomCol] = 2

		// make the snakeCell reset
		setSnakeCells([[startRow, startCol]]);
        setFoodCell([randomRow, randomCol])
        setGrid(dummy);
		setIsGameOver(false);
		setDirection("");
	};

	if (isGameOver) return <RestartPopup action={reset}/>;
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
