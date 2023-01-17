import React from "react";
import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";
import TimeRenderer from "./TimeRenderer";
import { useSearchParams } from "react-router-dom";

function RemainingTime({ og, ct, rt, setOg }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const params = new URLSearchParams(window.location.search);
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
					onComplete={() => {
						if (params.get("tl")) {
							searchParams.delete("tl");
							setSearchParams(searchParams);
						}

						setOg(false);
						console.log("countdown ends");
					}}
				></Countdown>
			</b>
			min
		</Typography>
	);
}

export default RemainingTime;
