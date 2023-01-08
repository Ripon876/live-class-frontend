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
					new Date().toJSON().slice(0, 10) +
						"T" +
						data.data.st +
						":00"
				);

				if (data.data.msg) {
					setMsg(data.data.msg);
				}
			})
			.catch((err) => console.log("err :", err));
	}, []);

	return (
		<div style={{ marginTop: "100px", textAlign: "center" }}>
			<Typography variant="h4" mb="10px">
				Remainig Time
			</Typography>
			<Typography
				variant="h1"
				mb="20px"
				sx={{ color: "#66bb6a", fontSize: "50px", fontWeight: "bold" }}
			>
				{startingTime && (
					<Countdown
						key={Date.now()}
						date={
							Date.now() + (Date.parse(startingTime) - Date.now())
						}
						renderer={renderer}
					>
						<Completionist msg={msg} />
					</Countdown>
				)}
			</Typography>
		</div>
	);
}

export default RemainingTime;

const Completionist = ({ msg }) => (
	<span> {msg ? msg : "Exam will start shortly"} </span>
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
