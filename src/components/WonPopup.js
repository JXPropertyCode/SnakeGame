import "./WonPopup.css";
const WonPopup = (props) => {
	return (
		<div className="popup">
			<div className="popup-inner">
				<h1>You Won! Want to restart?</h1>
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

export default WonPopup;
