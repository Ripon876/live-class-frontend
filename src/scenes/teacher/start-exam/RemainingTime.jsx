import React from "react";
import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";
import TimeRenderer from "./TimeRenderer";

function RemainingTime({ og, ct, rt }) {
	return (
		<Typography
			variant="h4"
			align="right"
			pr="10px"
			mb="5px"
			style={{
				opacity: og ? "1" : 0,
			}}
		>
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

export default RemainingTime;
