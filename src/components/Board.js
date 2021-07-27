import { useEffect, useRef, useState } from "react";

const Board = () => {
	const [grid, setGrid] = useState([]);
	const [snakeCells, setSnakeCells] = useState([[10, 10]]);

	useEffect(() => {
		let dummy = [];
		for (let i = 0; i < 50; i++) {
			let row = [];
			for (let k = 0; k < 50; k++) {
				row.push(0);
			}
			dummy.push(row);
		}

		// const snakeHead = snakeCells[0]
		// dummy[snakeHead[0]][snakeHead[1]] = 1
		setGrid(dummy);
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.key === "d") {
				console.log(e.key);
				setSnakeCells((cells) => {
					let head = cells[cells.length - 1];
					head[1] += 1;
					console.log("head:", head);
					return [...cells, head];
				});
			}
			if (e.key === "a") {
				console.log(e.key);
				setSnakeCells((cells) => {
					let head = cells[cells.length - 1];
					head[1] -= 1;
					console.log("head:", head);
					return [...cells, head];
				});
			}
			if (e.key === "w") {
				console.log(e.key);
				setSnakeCells((cells) => {
					let head = cells[cells.length - 1];
					head[0] -= 1;
					console.log("head:", head);
					return [...cells, head];
				});
			}
			if (e.key === "s") {
				console.log(e.key);
				setSnakeCells((cells) => {
					let head = cells[cells.length - 1];
					head[0] += 1;
					console.log("head:", head);
					return [...cells, head];
				});
			}
		});
		return () =>
			window.removeEventListener("keydown", (e) => console.log(e.key));
	}, []);

	useEffect(() => {
		setGrid((grid) => {
			for (let snakeCell of snakeCells) {
				grid[snakeCell[1]][snakeCell[0]] = 1;
			}
			return grid;
		});
	}, [snakeCells]);

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
												grid[k][i] === 0
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
