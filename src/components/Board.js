// import { useEffect, useState, useRef } from "react";
// import RestartPopup from "./RestartPopup";
// import "./Board.css";

// const Board = () => {
// 	// starting place of the snake
// 	const startRow = 0;
// 	const startCol = 0;

// 	const gridWidth = 10;
// 	const gridHeight = 10;
// 	const pixelWidth = 10;
// 	const pixelHeight = 10;
// 	const size = gridWidth * pixelWidth;
// 	const [grid, setGrid] = useState([]);

// 	// the direction of the interval
// 	const [direction, setDirection] = useState("");

// 	const directionInterval = useRef(null);

// 	// starting place
// 	const [snakeCells, setSnakeCells] = useState([[startRow, startCol]]);
// 	const [foodCell, setFoodCell] = useState([]);
// 	const [isGameOver, setIsGameOver] = useState(false);

// 	const isOutOfBound = (head, grid) => {
// 		// console.log("IsOutOfBound Grid:", grid)

// 		if (
// 			head[0] < 0 ||
// 			head[0] >= gridHeight ||
// 			head[1] < 0 ||
// 			head[1] >= gridWidth
// 		) {
// 			console.log("WENT OUT OF BOUNDS");
// 			return true;
// 		}

// 		if (grid[head[0]][head[1]] === 1) {
// 			console.log("THE SNAKE JUST ATE ITSELF");
// 			return true;
// 		}

// 		return false;
// 	};

// 	useEffect(() => {
// 		console.log("useEffect activated");
// 		// if direction is empty, it won't run further or else the snakeCells = [[0,0], [0,0]]
// 		// if isGameOver, then it won't keep running any direction
// 		if (isGameOver || direction === "") return;
// 		const head = [...snakeCells[snakeCells.length - 1]];
// 		console.log("direction:", direction);

// 		// this will clear any potential interval going on and set a new interval
// 		clearInterval(directionInterval.current);
// 		directionInterval.current = setInterval(() => {
// 			console.log("setInterval Active...");
// 			if (direction === "d") head[1] += 1;
// 			if (direction === "s") head[0] += 1;
// 			if (direction === "w") head[0] -= 1;
// 			if (direction === "a") head[1] -= 1;

// 			if (isOutOfBound(head, grid)) {
// 				// console.log("This is Out of Bounds");
// 				setIsGameOver(true);
// 				setSnakeCells([[startRow, startCol]]);
// 				clearInterval(directionInterval.current);
// 			} else {
// 				// prevents the snakeCells from getting larger since it has not eaten anything
// 				setSnakeCells([head]);
// 				// setSnakeCells([...snakeCells, head]);
// 			}
// 		}, 500);
// 	}, [direction]);

// 	// Function to generate random number
// 	const randomNumber = (min, max) => {
// 		return Math.floor(Math.random() * (max - min) + min);
// 	};

// 	// create the initial grid. Only runs when the program first starts
// 	// useEffect(() => {
// 	// 	// console.log("useEffect activated");
// 	// 	// console.log("Initializing Grid");
// 	// 	let dummy = [];
// 	// 	for (let i = 0; i < gridWidth; i++) {
// 	// 		let row = [];
// 	// 		for (let k = 0; k < gridHeight; k++) {
// 	// 			row.push(0);
// 	// 		}
// 	// 		dummy.push(row);
// 	// 	}
// 	// 	const snakeHead = snakeCells[0];
// 	// 	// starting place
// 	// 	dummy[snakeHead[0]][snakeHead[1]] = 1;

// 	// 	let randomRow = randomNumber(startRow+1, gridWidth - 1);
// 	// 	let randomCol = randomNumber(startCol+1, gridHeight - 1);

// 	// 	console.log("randomRow:", randomRow);
// 	// 	console.log("randomCol:", randomCol);

// 	// 	let foodArr = [randomRow, randomCol]

// 	// 	setFoodCell(foodArr)
// 	// 	// console.log("foodCell:", foodCell)

// 	// 	dummy[randomRow][randomCol] = 2;
// 	// 	console.log("dummy initialization:", dummy)
// 	// 	setGrid(dummy);
// 	// }, []);

// 	const onKeyDown = (e) => {
// 		console.log("Key Detected:", e.key);
// 		return setDirection(e.key);
// 	};

// 	// to track keyboard input, if the window pops up, it would ignore it
// 	// not sure if adding the dependency would affect other parts of the code
// 	useEffect(() => {
// 		console.log("useEffect activated");
// 		console.log("Listening to KeyDown:", !isGameOver);
// 		if (!isGameOver) {
// 			console.log("Actively Listening to KeyDowns");
// 			window.addEventListener("keydown", onKeyDown);
// 		} else {
// 			console.log("NOT Listening to KeyDowns");
// 			window.removeEventListener("keydown", onKeyDown);
// 			clearInterval(directionInterval.current);
// 		}

// 		return () => {
// 			window.removeEventListener("keydown", onKeyDown);
// 			clearInterval(directionInterval.current);
// 		};
// 	}, [isGameOver]);

// 	// detects the changes of snakecells
// 	// note: this runs as if it was initialzation, probably because useState can detect that when it is first initialized, it is not [] instead it had values in it?
// 	// shouldn't be the case but it could have happened like that since thats the only explaination I can see how the dependency is activated
// 	useEffect(() => {
// 		console.log("useEffect activated");
// 		if (isGameOver === false) {
// 			console.log("Creating New Grid");
// 			setGrid(() => {
// 				// creates a new grid since I gotta see which snakecell is active
// 				// this is probably what makes the program slow tho
// 				let dummy = [];
// 				for (let i = 0; i < gridWidth; i++) {
// 					let row = [];
// 					for (let k = 0; k < gridHeight; k++) {
// 						row.push(0);
// 					}
// 					dummy.push(row);
// 				}

// 				console.log("snakeCells:", snakeCells);
// 				// insert the snakeCells values
// 				for (let snakeCell of snakeCells) {
// 					dummy[snakeCell[0]][snakeCell[1]] = 1;
// 				}

// 				let randomRow = randomNumber(startRow + 1, gridWidth - 1);
// 				let randomCol = randomNumber(startCol + 1, gridHeight - 1);

// 				console.log("randomRow:", randomRow);
// 				console.log("randomCol:", randomCol);

// 				let foodArr = [randomRow, randomCol];

// 				dummy[randomRow][randomCol] = 2;

// 				setFoodCell(foodArr);

// 				console.log("foodCell:", foodCell);
// 				console.log("foodCell[0]:", foodCell[0]);
// 				console.log("foodCell[1]:", foodCell[1]);
// 				// dummy[foodCell[0]][foodCell[1]] = 1

// 				console.log(dummy);
// 				// setGrid now becomes a new grid with updated snakeCells
// 				return dummy;
// 			});
// 		}
// 	}, [snakeCells]);

// 	// resets the entire grid
// 	const reset = () => {
// 		console.log("Reset the Grid");
// 		let dummy = [];
// 		for (let i = 0; i < gridWidth; i++) {
// 			let row = [];
// 			for (let k = 0; k < gridHeight; k++) {
// 				row.push(0);
// 			}
// 			dummy.push(row);
// 		}
// 		// since the snakeCell is an array within an array
// 		const snakeHead = snakeCells[0];
// 		// starting place
// 		dummy[snakeHead[0]][snakeHead[1]] = 1;

// 		// make the snakeCell reset
// 		setSnakeCells([[startRow, startCol]]);
// 		// give the state grid a new grid
// 		setGrid(dummy);
// 		setIsGameOver(false);
// 		setDirection("");
// 	};

// 	if (isGameOver) return <RestartPopup action={reset} />;

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
// 												(grid[i][k] === 2 && "yellow") ||
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

// export default Board;
