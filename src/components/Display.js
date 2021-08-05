const Display = (props) => {
    return (
		<div className="center">
			<h3>Snake Game</h3>
			<p>Movement: W, S, D, A</p>
			<div
				style={{
					width: props.size,
					height: props.size,
					background: "red",
				}}
			>
				{props.grid.map((row, i) => {
					return (
						<div
							key={i + "row"}
							style={{ display: "flex", flexDirection: "row" }}
						>
							{row.map((v, k) => {
                                const colors = ['white', 'green', 'red']
								return (
									<div
										key={k + "cell"}
										style={{
											width: props.pixelWidth,
											height: props.pixelHeight,
											background: colors[props.grid[i][k]],
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
}

export default Display