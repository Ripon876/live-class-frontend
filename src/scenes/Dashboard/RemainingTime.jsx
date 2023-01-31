import { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";

function RemainingTime() {
	const [startingTime, setStartingTime] = useState(0);
	const [msg, setMsg] = useState("");
	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/get-start-time")
			.then((data) => {
				setStartingTime(
					Date.parse(new Date(data.data.st).toString()) - Date.now()
				);
				// if (
				// 	!Date.parse(new Date(data.data.st).toString()) - Date.now()
				// ) {
				// 	console.log(
				// 		Date.parse(new Date(data.data.st).toString()) -
				// 			Date.now()
				// 	);
				// 	setStartingTime((old) => false);
				// }
				// (new Date('Fri Jan 13 2023 15:32:50')).toUTCString()
				// 'Fri, 13 Jan 2023 09:32:50 GMT'
				// (new Date('Fri, 13 Jan 2023 09:32:50 GMT')).toString()

				if (data.data.msg) {
					setMsg(data.data.msg);
				}
			})
			.catch((err) => console.log("err :", err));
	}, []);

	return (
		<div style={{ marginTop: "100px", textAlign: "center" }}>
			{!msg && (
				<Typography variant="h4" mb="10px">
					Remaining Time
				</Typography>
			)}
			<Typography
				variant="h1"
				mb="20px"
				sx={{ color: "#66bb6a", fontSize: "50px", fontWeight: "bold" }}
			>
				{startingTime > 0 ? (
					<Countdown
						key={Date.now()}
						date={Date.now() + startingTime}
						renderer={renderer}
					>
						<Completionist msg={msg} />
					</Countdown>
				) : (
					<>
						{msg ? (
							<Typography variant="h4" mb="10px">
								{msg}
							</Typography>
						) : (
							<Typography variant="h4" mb="10px">
								There are some problems to show remaining time
							</Typography>
						)}
					</>
				)}
			</Typography>
		</div>
	);
}

export default RemainingTime;

const Completionist = ({ msg }) => (
	<span> {msg ? msg : "Exams started"} </span>
);

const renderer = ({ hours, minutes, seconds, completed }) => {
	if (completed) {
		// Render a completed state
		return <Completionist />;
	} else {
		// Render a countdown
		return (
			<span>
				{" "}
				{hours < 10 ? "0" + hours : hours}:
				{minutes < 10 ? "0" + minutes : minutes}:
				{seconds < 10 ? "0" + seconds : seconds}
			</span>
		);
	}
};
