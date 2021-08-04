import { useEffect, useState, useRef } from "react";
import RestartPopup from "./RestartPopup";
import WonPopup from './WonPopup'
import "./Board.css";

const gridWidth = 2;
const gridHeight = 2;
const createMatrix = () => {
	let dummy = [];
	for (let i = 0; i < gridWidth; i++) {
		let row = [];
		for (let k = 0; k < gridHeight; k++) {
			row.push(0);
		}
		dummy.push(row);
	}
	return dummy;
};

const BoardTestCopy = () => {
	const pixelWidth = 10;
	const pixelHeight = 10;
	const size = gridWidth * pixelWidth;

	const [snakeLength, setSnakeLength] = useState(1);

	const startRow = 0;
	const startCol = 0;

	const [snakeCells, setSnakeCells] = useState([]);

	const [foodCell, setFoodCell] = useState([]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [grid, setGrid] = useState([]);
	const [direction, setDirection] = useState("");
	const [won, setWon] = useState(false)

	const interval = useRef(null);

	// Function to generate random number for foodCell
	const randomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// detect for avaiable spaces
	const avaiableSpace = (dummy, possibleRow, possibleCol) => {
		if (dummy[possibleRow][possibleCol] === 1) {
			return false;
		}
		return true;
	};

	const detectRelocation = (dummy) => {
		let randomRow = randomNumber(0, gridWidth - 1);
		let randomCol = randomNumber(0, gridHeight - 1);
		while (avaiableSpace(dummy, randomRow, randomCol) === false) {
			// console.log("Recalculating Avaiable Space");
			randomRow = randomNumber(0, gridWidth - 1);
			randomCol = randomNumber(0, gridHeight - 1);

			// console.log("new randomRow:", randomRow);
			// console.log("new randomCol:", randomCol);
		}
		return [randomRow, randomCol];
	};

	// initialization
	useEffect(() => {
		// console.log("Initialization");
		let dummy = createMatrix();

		// start of the snakeHead
		dummy[startRow][startCol] = 1;

		let foodCoordinate = detectRelocation(dummy);
		// console.log("initialization foodCoordinate:", foodCoordinate);

		dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
		// console.log("foodCell:", [foodCoordinate[0], foodCoordinate[1]]);

		console.log("dummy:", dummy);

		console.log("starting snakeCells:", [[startRow, startCol]]);
		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		setGrid(dummy);

		return () => clearInterval(interval.current);
	}, []);

	const onKeyDown = (e) => {
		// console.log("Key Detected:", e.key);

		if (e.key === "p") {
			setIsGameOver(true);
		} else {
			setDirection(e.key);
		}
	};

	useEffect(() => {
		// console.log("useEffect Listening to KeyDown:", !isGameOver);
		if (!isGameOver) {
			// console.log("Actively Listening to KeyDowns");
			window.addEventListener("keydown", onKeyDown);
		} else {
			// console.log("NOT Listening to KeyDowns");
			window.removeEventListener("keydown", onKeyDown);
			// clearInterval(directionInterval.current);
			clearInterval(interval.current);
		}

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			// clearInterval(directionInterval.current);
			clearInterval(interval.current);
		};
	}, [isGameOver]);

	const collision = (head, grid) => {
		// console.log("Detecting Collision...");
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
			// console.log("collision with self:", grid)
			console.log("Collision Detected: Self");
			return true;
		}

		if (grid[currRow][currCol] === 0) {
			console.log("No Collision Detected");
			return false;
		}

		return false;
	};

	useEffect(() => {
		if (isGameOver || snakeCells.length === 0 || direction === "") {
			clearInterval(interval.current);
			return;
		}

		if (snakeLength === gridWidth * gridHeight) {
			setIsGameOver(true);
			clearInterval(interval.current);
			return;
		}

		console.log("given snakeCells:", snakeCells);
		clearInterval(interval.current);
		interval.current = setTimeout(() => {
			let prevHead = [...snakeCells[snakeCells.length - 1]];
			console.log("prevHead:", prevHead);
			let nextHead = [...prevHead];

			if (direction === "d") nextHead[1] += 1;
			if (direction === "s") nextHead[0] += 1;
			if (direction === "w") nextHead[0] -= 1;
			if (direction === "a") nextHead[1] -= 1;

			// this doesn't detect eating food
			// only detects boundaries and eating self
			if (collision(nextHead, grid)) {
				setIsGameOver(true);
				clearInterval(interval.current);
				return;
			}

			let foodCoordinate = [...foodCell];
			let snakeTest = [...snakeCells];
			console.log("snakeTest:", snakeTest);
			// what happens when it eats a food
			// note this only makes sure it doesn't hit the head, if theres a tail, it won't work, it would override each other
			if (nextHead[0] === foodCell[0] && nextHead[1] === foodCell[1]) {



				console.log("Eaten");
				console.log("new foodCoordinate:", foodCoordinate);
				console.log("snakeLength:", snakeLength + 1);

				setSnakeLength((length) => length + 1);

				if (snakeLength + 1 === gridWidth * gridHeight) {
					setWon(true);
					return;
				}

				grid[nextHead[0]][nextHead[1]] = 1

				console.log("new tail:", [...snakeTest, [...nextHead]]);
				snakeTest = [...snakeTest, [...nextHead]];

				foodCoordinate = detectRelocation(grid);
				setFoodCell([...foodCoordinate]);


			} else {
				console.log("snakeLength:", snakeLength);
				console.log("Current SnakeCells:", snakeCells);
				snakeTest = [...snakeTest, [...nextHead]];
				console.log("snakeTest added tail:", snakeTest);
				snakeTest.shift();
				console.log("removed tail:", [...snakeTest]);
			}

			let dummy = createMatrix();

			for (let cell of snakeTest) {
				dummy[cell[0]][cell[1]] = 1;
			}

			dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
			setSnakeCells([...snakeTest]);
			setGrid(dummy);
		}, 500);
	}, [isGameOver, snakeCells, direction]);

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
		setSnakeLength(1);
		clearInterval(interval.current);
		setWon(false)
	};

	if (isGameOver) return <RestartPopup action={reset} />;
	if (won) return <WonPopup action={reset} />;
	console.log("Current Direction:", direction);
	return (
		<div className="center">
			<p>Snake Board</p>
			<div
				style={{
					width: size,
					height: size,
					background: "red",
				}}
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
