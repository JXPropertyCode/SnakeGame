import { useEffect, useState, useRef } from "react";
import RestartPopup from "./RestartPopup";
import WonPopup from "./WonPopup";
import Display from "./Display";
import "./Board.css";

const startRow = 0;
const startCol = 0;
const pixelWidth = 15;
const pixelHeight = 15;
const gridWidth = 10;
const gridHeight = 10;
const size = gridWidth * pixelWidth;
let matrix = []

// Function to generate random number for foodCell
const randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// detect for avaiable spaces
const avaiableSpace = (matrix, possibleRow, possibleCol) => {
	if (matrix[possibleRow][possibleCol] === 1) {
		return false;
	}
	return true;
};

const detectRelocation = (matrix) => {
	let randomRow = randomNumber(0, gridWidth - 1);
	let randomCol = randomNumber(0, gridHeight - 1);
	while (avaiableSpace(matrix, randomRow, randomCol) === false) {
		randomRow = randomNumber(0, gridWidth - 1);
		randomCol = randomNumber(0, gridHeight - 1);
	}
	return [randomRow, randomCol];
};

const createMatrix = () => {
	let dummy = [];
	for (let i = 0; i < gridWidth; i++) {
		let row = [];
		for (let k = 0; k < gridHeight; k++) {
			row.push(0);
		}
		dummy.push(row);
	}
	dummy[startRow][startCol] = 1;
	return dummy;
};

const resetMatrix = (matrix) => {
	for (let i=0; i<gridWidth; i++) {
		for (let j=0; j<gridHeight; j++) {
			matrix[i][j] = 0
		}
	}
	return matrix
}

const collision = (head, grid) => {
	let currRow = head[0];
	let currCol = head[1];

    // out of bounds
	if (
		currRow < 0 ||
		currRow >= gridHeight ||
		currCol < 0 ||
		currCol >= gridWidth
	) {
		return true;
	}

	// eating itself
	if (grid[currRow][currCol] === 1) {
		return true;
	}

	if (grid[currRow][currCol] === 0) {
		return false;
	}

	return false;
};

const BoardTestCopy = () => {
	const [snakeLength, setSnakeLength] = useState(1);
	const [snakeCells, setSnakeCells] = useState([]);
	const [foodCell, setFoodCell] = useState([]);
	const [isGameOver, setIsGameOver] = useState(false);
	const [direction, setDirection] = useState("");
	const [won, setWon] = useState(false);
	const interval = useRef(null);

	// initialization
	useEffect(() => {
		matrix = createMatrix()
		let foodCoordinate = detectRelocation(matrix);
		matrix[foodCoordinate[0]][foodCoordinate[1]] = 2;
		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		return () => clearInterval(interval.current);
	}, []);

	const onKeyDown = (e) => {
		if (e.key === "p") {
			clearInterval(interval.current);
			return;
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

	useEffect(() => {
		if (isGameOver || snakeCells.length === 0 || direction === "") {
			clearInterval(interval.current);
			return;
		}

		clearInterval(interval.current);
		interval.current = setTimeout(() => {
			let prevHead = [...snakeCells[snakeCells.length - 1]];
			let nextHead = [...prevHead];

			if (direction === "d") nextHead[1] += 1;
			if (direction === "s") nextHead[0] += 1;
			if (direction === "w") nextHead[0] -= 1;
			if (direction === "a") nextHead[1] -= 1;

			// only detects boundaries and eating self
			if (collision(nextHead, matrix)) {
				setIsGameOver(true);
				clearInterval(interval.current);
				return;
			}

			let foodCoordinate = [...foodCell];
			let snakeTest = [...snakeCells];

			if (nextHead[0] === foodCell[0] && nextHead[1] === foodCell[1]) {
				setSnakeLength((length) => length + 1);
				if (snakeLength + 1 === gridWidth * gridHeight) {
					setWon(true);
					return;
				}

				matrix[prevHead[0]][prevHead[1]] = 1;
				matrix[nextHead[0]][nextHead[1]] = 1;
				snakeTest = [...snakeTest, [...nextHead]];
				foodCoordinate = detectRelocation(matrix);
				setFoodCell([...foodCoordinate]);
			} else {
				snakeTest = [...snakeTest, [...nextHead]];
				snakeTest.shift();
			}

			matrix = resetMatrix(matrix)

			for (let cell of snakeTest) {
				matrix[cell[0]][cell[1]] = 1;
			}
			matrix[foodCoordinate[0]][foodCoordinate[1]] = 2;
			setSnakeCells([...snakeTest]);
		}, 300);
	}, [isGameOver, snakeCells, direction]);

	const reset = () => {
		matrix = resetMatrix(matrix);
		matrix[startRow][startCol] = 1;
		let foodCoordinate = detectRelocation(matrix, startRow, startCol);
		matrix[foodCoordinate[0]][foodCoordinate[1]] = 2;

		setSnakeCells([[startRow, startCol]]);
		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
		setIsGameOver(false);
		setDirection("");
		setSnakeLength(1);
		clearInterval(interval.current);
		setWon(false);
	};

	if (isGameOver) return <RestartPopup action={reset} />;
	if (won) return <WonPopup action={reset} />;
	return (
		<Display
			gridWidth={gridWidth}
			grid={matrix}
			pixelWidth={pixelWidth}
			pixelHeight={pixelHeight}
			size={size}
		></Display>
	);
};

export default BoardTestCopy;
