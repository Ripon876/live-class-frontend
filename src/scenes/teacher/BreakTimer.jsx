import Countdown from "react-countdown";

function BreakTimer({ ct, rt }) {
	return (
		<>
			:{" "}
			<b pl="5px">
				<Countdown
					key={ct}
					date={ct + rt * 60 * 1000}
					renderer={TimeRenderer}
				/>
			</b>
			min
		</>
	);
}

export default BreakTimer;

const TimeRenderer = ({ minutes, seconds }) => {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
};
