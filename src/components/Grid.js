const Grid = (size, grid) => {
	const pixelWidth = 10;
	const pixelHeight = 10;
    console.log("grid:", grid)

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

export default Grid