import "./RestartPopup.css";

const RestartPopup = (props) => {
	console.log("Activated RestartPopup");

	return (
		<div className="popup">
			<div className="popup-inner">
				<h1>You Lost! Want to restart?</h1>
				<button
					className="close-btn"
					onClick={() => {
						props.action();
					}}
				>
					Restart
				</button>
			</div>
		</div>
	);
};

export default RestartPopup;
