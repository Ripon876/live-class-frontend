import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";

function Timer({ ct, rt }) {
	return (
		<Typography variant="h4" align="right" pr="10px" mb="5px">
			Remainig Time :
			<b pl="5px">
				<Countdown
					key={ct}
					date={ct + rt * 60 * 1000}
					renderer={TimeRenderer}
				/>
			</b>
			min
		</Typography>
	);
}

export default Timer;

const TimeRenderer = ({ minutes, seconds }) => {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
};
