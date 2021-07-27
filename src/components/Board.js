import { useEffect, useRef, useState } from "react";

const Board = () => {
	const [grid, setGrid] = useState([]);
	const [snakeCells, setSnakeCells] = useState([[0, 0]]);

	useEffect(() => {
		let dummy = [];
		for (let i = 0; i < 50; i++) {
			let row = [];
			for (let k = 0; k < 50; k++) {
				row.push(0);
			}
			dummy.push(row);
		}

		const snakeHead = snakeCells[0];
		// console.log("snakeHead:", snakeHead)
		
		// starting place
		dummy[snakeHead[0]][snakeHead[1]] = 1;

		// dummy[0][0] = 1
		// console.log("dummy[0]:", dummy[0])
		setGrid(dummy);
	}, []);

	const onKeyDown = (e) => {
		// console.log("Activated Event Listener: KeyDown")
		if (e.key === "d") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[1] += 1;
				console.log("head:", head);
				return [...cells, head];
			});
		}
		if (e.key === "a") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[1] -= 1;
				console.log("head:", head);
				return [...cells, head];
			});
		}
		if (e.key === "w") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[0] -= 1;
				console.log("head:", head);
				// console.log("grid[0]:", grid[0])
				return [...cells, head];
			});
		}
		if (e.key === "s") {
			console.log(e.key);
			setSnakeCells((cells) => {
				let head = [...cells[cells.length - 1]];
				head[0] += 1;
				console.log("head:", head);
				// console.log("grid[0]:", grid[0])
				return [...cells, head];
			});
		}
	};

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	useEffect(() => {
		console.log("useEffect setGrid");
		setGrid((grid) => {
			console.log("snakeCells:", snakeCells)
			for (let snakeCell of snakeCells) {
				// console.log("grid[snakeCell[1]][snakeCell[0]]:", grid[snakeCell[1]][snakeCell[0]])
				// console.log("grid[0]:", grid[0])
				grid[snakeCell[0]][snakeCell[1]] = 1;
			}
			console.log(grid[0]);
			return grid;
		});
	}, [snakeCells]);

	console.log("Final Return");
	return (
		<div>
			<p>Snake Board</p>
			<div
				style={{ width: "500px", height: "500px", background: "green" }}
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
											width: "10px",
											height: "10px",
											background:
												grid[i][k] === 0
													? "blue"
													: "red",
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
