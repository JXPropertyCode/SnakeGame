// import { useEffect, useState, useRef } from "react";
// import RestartPopup from "./RestartPopup";
// import "./Board.css";

// const gridWidth = 5;
// const gridHeight = 5;
// const createMatrix = () => {
// 	let dummy = [];
// 	for (let i = 0; i < gridWidth; i++) {
// 		let row = [];
// 		for (let k = 0; k < gridHeight; k++) {
// 			row.push(0);
// 		}
// 		dummy.push(row);
// 	}
// 	return dummy;
// };

// const BoardTestCopy = () => {
// 	const pixelWidth = 10;
// 	const pixelHeight = 10;
// 	const size = gridWidth * pixelWidth;

// 	const [snakeLength, setSnakeLength] = useState(1);

// 	const startRow = 0;
// 	const startCol = 0;

// 	const [snakeCells, setSnakeCells] = useState([]);
// 	// const [snakeHead, setSnakeHead] = useState([]);

// 	const [foodCell, setFoodCell] = useState([]);
// 	const [isGameOver, setIsGameOver] = useState(false);
// 	const [grid, setGrid] = useState([]);
// 	const [direction, setDirection] = useState("");
// 	// const [isEaten, setIsEaten] = useState(false);

// 	const interval = useRef(null);

// 	// const directionInterval = useRef(null);

// 	// Function to generate random number for foodCell
// 	const randomNumber = (min, max) => {
// 		return Math.floor(Math.random() * (max - min + 1)) + min;
// 	};

// 	// detect for avaiable spaces
// 	const avaiableSpace = (
// 		dummy,
// 		currRow,
// 		currCol,
// 		possibleRow,
// 		possibleCol
// 	) => {
// 		if (currRow === possibleRow && currCol === possibleCol) {
// 			return false;
// 		} else if (dummy[possibleRow][possibleCol] === 0) {
// 			return true;
// 		}
// 		return false;
// 	};

// 	const detectRelocation = (dummy, startRow, startCol) => {
// 		let randomRow = randomNumber(0, gridWidth - 1);
// 		let randomCol = randomNumber(0, gridHeight - 1);
// 		while (
// 			avaiableSpace(dummy, startRow, startCol, randomRow, randomCol) ===
// 			false
// 		) {
// 			// console.log("Recalculating Avaiable Space");
// 			randomRow = randomNumber(0, gridWidth - 1);
// 			randomCol = randomNumber(0, gridHeight - 1);

// 			// console.log("new randomRow:", randomRow);
// 			// console.log("new randomCol:", randomCol);
// 		}
// 		return [randomRow, randomCol];
// 	};

// 	// initialization
// 	useEffect(() => {
// 		// console.log("Initialization");
// 		let dummy = createMatrix();

// 		// start of the snakeHead
// 		dummy[startRow][startCol] = 1;

// 		let foodCoordinate = detectRelocation(dummy, startRow, startCol);
// 		// console.log("initialization foodCoordinate:", foodCoordinate);

// 		dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;
// 		// console.log("foodCell:", [foodCoordinate[0], foodCoordinate[1]]);

// 		console.log("dummy:", dummy);

// 		setSnakeCells([[startRow, startCol]]);
// 		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
// 		setGrid(dummy);

// 		return () => clearInterval(interval.current);
// 	}, []);

// 	const onKeyDown = (e) => {
// 		// console.log("Key Detected:", e.key);

// 		if (e.key === "p") {
// 			setIsGameOver(true);
// 		} else {
// 			setDirection(e.key);
// 		}
// 	};

// 	useEffect(() => {
// 		// console.log("useEffect Listening to KeyDown:", !isGameOver);
// 		if (!isGameOver) {
// 			// console.log("Actively Listening to KeyDowns");
// 			window.addEventListener("keydown", onKeyDown);
// 		} else {
// 			// console.log("NOT Listening to KeyDowns");
// 			window.removeEventListener("keydown", onKeyDown);
// 			// clearInterval(directionInterval.current);
// 			clearInterval(interval.current);
// 		}

// 		return () => {
// 			window.removeEventListener("keydown", onKeyDown);
// 			// clearInterval(directionInterval.current);
// 			clearInterval(interval.current);
// 		};
// 	}, [isGameOver]);

// 	const collision = (head, grid) => {
// 		// console.log("Detecting Collision...");
// 		let currRow = head[0];
// 		let currCol = head[1];

// 		// going out of bounds
// 		if (
// 			currRow < 0 ||
// 			currRow >= gridHeight ||
// 			currCol < 0 ||
// 			currCol >= gridWidth
// 		) {
// 			console.log("Collision Detected: Boundaries");
// 			return true;
// 		}

// 		// eating itself
// 		if (grid[currRow][currCol] === 1) {
// 			// console.log("collision with self:", grid)
// 			console.log("Collision Detected: Self");
// 			return true;
// 		}

// 		if (grid[currRow][currCol] === 0) {
// 			console.log("No Collision Detected");
// 			return false;
// 		}

// 		return false;
// 	};

// 	// detects direction and foodCell useState() changes
// 	// useEffect(() => {
// 	// 	if (snakeCells.length === 0) {
// 	// 		console.log("SnakeCells is Empty");
// 	// 		return;
// 	// 	}

// 	// 	if (direction === "") {
// 	// 		console.log("No Direction Assigned Yet...");
// 	// 		return;
// 	// 	}

// 	// 	let prevHead = [...snakeCells[snakeCells.length - 1]];
// 	// 	let tail = [...snakeCells];
// 	// 	let foodCellArr = [...foodCell];
// 	// 	let currSnakeLength = snakeLength

// 	// 	clearInterval(directionInterval.current);
// 	// 	directionInterval.current = setInterval(() => {
// 	// 		console.log("prevHead:", prevHead);
// 	// 		console.log("Given snakeLength:", snakeLength);
// 	// 		// let currSnakeLength = snakeLength
// 	// 		let nextHead = [...prevHead];

// 	// 		console.log("Recreating the Grid...");
// 	// 		if (direction === "d") nextHead[1] += 1;
// 	// 		if (direction === "s") nextHead[0] += 1;
// 	// 		if (direction === "w") nextHead[0] -= 1;
// 	// 		if (direction === "a") nextHead[1] -= 1;

// 	// 		// this doesn't detect eating food
// 	// 		// only detects boundaries and eating self
// 	// 		if (collision(nextHead, grid)) {
// 	// 			setIsGameOver(true);
// 	// 			clearInterval(directionInterval.current);
// 	// 			return;
// 	// 		}

// 	// 		let newHead = [nextHead[0], nextHead[1]];
// 	// 		console.log("newHead:", newHead);

// 	// 		tail = [[...newHead]];
// 	// 		prevHead = [...tail[tail.length - 1]];

// 	// 		let foodCoordinate = [...foodCellArr];
// 	// 		// detect collision with food
// 	// 		if (
// 	// 			foodCoordinate[0] === newHead[0] &&
// 	// 			foodCoordinate[1] === newHead[1]
// 	// 		) {
// 	// 			console.log("Eaten");
// 	// 			// note this only makes sure it doesn't hit the head, if theres a tail, it won't work, it would override each other
// 	// 			foodCoordinate = detectRelocation(
// 	// 				dummy,
// 	// 				newHead[0],
// 	// 				newHead[1]
// 	// 			);
// 	// 			foodCellArr = [...foodCoordinate]
// 	// 			console.log("new foodCoordinate:", foodCoordinate);
// 	// 			currSnakeLength++
// 	// 			console.log("currSnakeLength:", currSnakeLength)
// 	// 			setSnakeLength((length) => length + 1);
// 	// 			setIsEaten(true)
// 	// 			setFoodCell([...foodCoordinate]);
// 	// 		}

// 	// 		console.log("tail:", tail);
// 	// 		for (let cell of tail) {
// 	// 			dummy[cell[0]][cell[1]] = 1;
// 	// 			dummy[foodCellArr[0]][foodCellArr[1]] = 2;
// 	// 		}
// 	// 		setSnakeCells([[...newHead]]);
// 	// 		setGrid(dummy);
// 	// 		console.log("Final Dummy:", dummy);
// 	// 	}, 500);
// 	// }, [direction]);

// 	useEffect(() => {
// 		if (isGameOver || snakeCells.length === 0 || direction === "") {
// 			clearInterval(interval.current);
// 			return;
// 		}

// 		console.log("snakeCells:", snakeCells);
// 		clearInterval(interval.current);
// 		interval.current = setTimeout(() => {
// 			let prevHead = [...snakeCells[snakeCells.length - 1]];
// 			console.log("prevHead:", prevHead);
// 			let nextHead = [...prevHead];

// 			if (direction === "d") nextHead[1] += 1;
// 			if (direction === "s") nextHead[0] += 1;
// 			if (direction === "w") nextHead[0] -= 1;
// 			if (direction === "a") nextHead[1] -= 1;

// 			// this doesn't detect eating food
// 			// only detects boundaries and eating self
// 			if (collision(nextHead, grid)) {
// 				setIsGameOver(true);
// 				clearInterval(interval.current);
// 				return;
// 			}

// 			let foodCoordinate = [...foodCell]

// 			// what happens when it eats a food
// 			// note this only makes sure it doesn't hit the head, if theres a tail, it won't work, it would override each other
// 			if (nextHead[0] === foodCell[0] && nextHead[1] === foodCell[1]) {
// 				console.log("Eaten");
// 				foodCoordinate = detectRelocation(
// 					grid,
// 					nextHead[0],
// 					nextHead[1]
// 				);
// 				console.log("new foodCoordinate:", foodCoordinate);
// 				// setSnakeLength((length) => length + 1);
// 				setFoodCell([...foodCoordinate]);
// 			}

// 			let dummy = createMatrix();
// 			// only the head shows on the grid, this doesn't account for tails
// 			dummy[nextHead[0]][nextHead[1]] = 1;
// 			// let the food stay
// 			dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;

// 			console.log("nextHead:", nextHead);

// 			// only keeps tracks onto the head for now, need to implement tracking the entire snake
// 			setSnakeCells([[...nextHead]]);
// 			// setSnakeCells([...snakeCells, [...nextHead]]);
// 			setGrid(dummy);
// 		}, 500);
// 	}, [isGameOver, snakeCells, direction]);

// 	const reset = () => {
// 		console.log("Reset the Grid");
// 		let dummy = [];
// 		for (let i = 0; i < gridHeight; i++) {
// 			let row = [];
// 			for (let k = 0; k < gridWidth; k++) {
// 				row.push(0);
// 			}
// 			dummy.push(row);
// 		}
// 		// starting place
// 		dummy[startRow][startCol] = 1;

// 		let foodCoordinate = detectRelocation(dummy, startRow, startCol);
// 		console.log("initialization foodCoordinate:", foodCoordinate);
// 		dummy[foodCoordinate[0]][foodCoordinate[1]] = 2;

// 		setSnakeCells([[startRow, startCol]]);
// 		setFoodCell([foodCoordinate[0], foodCoordinate[1]]);
// 		setGrid(dummy);
// 		setIsGameOver(false);
// 		setDirection("");
// 		setSnakeLength(1);
// 		clearInterval(interval.current);
// 	};

// 	// console.log("Running...")

// 	if (isGameOver) return <RestartPopup action={reset} />;
// 	// console.log("Current Direction:", direction);
// 	return (
// 		<div className="center">
// 			<p>Snake Board</p>
// 			<div style={{ width: size, height: size, background: "red" }}>
// 				{grid.map((row, i) => {
// 					return (
// 						<div
// 							key={i + "row"}
// 							style={{ display: "flex", flexDirection: "row" }}
// 						>
// 							{row.map((v, k) => {
// 								return (
// 									<div
// 										key={k + "cell"}
// 										style={{
// 											width: pixelWidth,
// 											height: pixelHeight,
// 											background:
// 												(grid[i][k] === 0 && "white") ||
// 												(grid[i][k] === 2 &&
// 													"yellow") ||
// 												(grid[i][k] === 1 && "green"),

// 											borderStyle: "solid",
// 											borderWidth: "thin",
// 											borderColor: "black",
// 										}}
// 									></div>
// 								);
// 							})}
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// };

// export default BoardTestCopy;
