const TimeRenderer = ({ minutes, seconds }) => {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
};

export default TimeRenderer;
