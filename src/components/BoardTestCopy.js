import { useEffect, useState, useRef } from "react";
import RestartPopup from "./RestartPopup";
import WonPopup from './WonPopup'
import Display from "./Display"
import "./Board.css";

const gridWidth = 3;
const gridHeight = 3;
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

		// console.log("dummy:", dummy);

		// console.log("starting snakeCells:", [[startRow, startCol]]);
		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		setGrid(dummy);

		return () => clearInterval(interval.current);
	}, []);

	const onKeyDown = (e) => {
		if (e.key === 'p') {
			clearInterval(interval.current);
			return
		}
		setDirection(e.key);
	};

	useEffect(() => {
		if (!isGameOver && !won) {
			window.addEventListener("keydown", onKeyDown);
		} else {
			window.removeEventListener("keydown", onKeyDown);
			clearInterval(interval.current);
		}

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			clearInterval(interval.current);
		};
	}, [isGameOver, won]);

	const collision = (head, grid) => {
		let currRow = head[0];
		let currCol = head[1];

		// going out of bounds
		if (
			currRow < 0 ||
			currRow >= gridHeight ||
			currCol < 0 ||
			currCol >= gridWidth
		) {
			// console.log("Collision Detected: Boundaries");
			return true;
		}

		// eating itself
		if (grid[currRow][currCol] === 1) {
			// console.log("Collision Detected: Self");
			return true;
		}

		if (grid[currRow][currCol] === 0) {
			// console.log("No Collision Detected");
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

		// console.log("given snakeCells:", snakeCells);
		clearInterval(interval.current);
		interval.current = setTimeout(() => {
			let prevHead = [...snakeCells[snakeCells.length - 1]];
			// console.log("prevHead:", prevHead);
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
			// console.log("snakeTest:", snakeTest);
			// what happens when it eats a food
			// note this only makes sure it doesn't hit the head, if theres a tail, it won't work, it would override each other
			if (nextHead[0] === foodCell[0] && nextHead[1] === foodCell[1]) {

				// console.log("Eaten");
				// console.log("snakeLength:", snakeLength + 1);

				setSnakeLength((length) => length + 1);

				if (snakeLength + 1 === gridWidth * gridHeight) {
					setWon(true);
					return;
				}

				grid[prevHead[0]][prevHead[1]] = 1
				grid[nextHead[0]][nextHead[1]] = 1

				// console.log("new tail:", [...snakeTest, [...nextHead]]);
				snakeTest = [...snakeTest, [...nextHead]];

				// console.log("Current Grid:", grid)
				foodCoordinate = detectRelocation(grid);
				// console.log("new foodCoordinate:", foodCoordinate);
				setFoodCell([...foodCoordinate]);

			} else {
				// console.log("Current Grid:", grid)

				// console.log("snakeLength:", snakeLength);
				snakeTest = [...snakeTest, [...nextHead]];
				snakeTest.shift();
				// console.log("new tail:", [...snakeTest]);
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
		// console.log("Reset the Grid");
		let dummy = createMatrix()
		dummy[startRow][startCol] = 1;
		let foodCoordinate = detectRelocation(dummy, startRow, startCol);
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
	return <Display gridWidth={gridWidth} grid={grid} pixelWidth={pixelWidth} pixelHeight={pixelHeight} size={size}></Display>
};

export default BoardTestCopy;
