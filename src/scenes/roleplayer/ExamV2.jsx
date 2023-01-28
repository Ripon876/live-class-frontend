import { useState, useEffect } from "react";
import MeetingComp from "../MeetingComp";
import StatetMsgs from "../MeetingComp";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BreakTimer from "./BreakTimer";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

let socket;
function ExamV2R() {
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [roomId, setRoomId] = useState(params.get("id") || "");
	const [cls, setCls] = useState(null);
	const [cd, setCd] = useState(null);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [mark, setMark] = useState(true);
	const [mSubmited, setMSubmited] = useState(false);
	const [onGoing, setOngoing] = useState(false);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const [breakTime, setBT] = useState(0);
	const [state, setState] = useState({
		break: false,
		delay: false,
		allStationEnd: false,
	});
	const roleplayer = useSelector((state) => state.user);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: roleplayer.id });

			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					if (cls?.pdf) {
						delete cls.pdf;
					}
					setCls(cls);
					setRemainingTime(cls.classDuration);
				} else {
					window.location.href = "/";
				}
			});

			socket.emit("rejoin", roleplayer.id, async (data, err) => {
				console.log(data, err);
				if (data) {
					setOngoing(true);
					setCurrentgTime(Date.now());
					setRemainingTime(data.rt);
				}
			});
		});

		socket.on("delayStart", () => {
			setCls((old) => null);
			setState({
				...state,
				delay: true,
			});
		});

		socket.on("delayEnd", () => {
			// uid = String(Math.floor(Math.random() * 50000) + "_Examiner");
			setState({
				...state,
				delay: false,
			});
		});

		socket.on("breakStart", (bt) => {
			setCls((old) => null);
			setBT((old) => bt);
			setState({
				...state,
				break: true,
			});
		});
		socket.on("breakEnd", () => {
			// uid = String(Math.floor(Math.random() * 50000) + "_Examiner");
			setState({
				...state,
				break: false,
			});
		});

		socket.on("examsEnded", () => {
			setState({
				...state,
				allStationEnd: true,
			});

			console.log("= = = = = = = = = = = =");
			console.log("= = = = = = = = = = = =");
			console.log("exams Ended");
			console.log("= = = = = = = = = = = =");
			console.log("= = = = = = = = = = = =");
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div
			style={{
				height: "90%",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			<Box
				sx={{ flexGrow: 1 }}
				className="px-3 mt-5 pt-5"
				sx={{
					display:
						!state?.delay && !state?.break && !state?.allStationEnd
							? "block"
							: "none",
				}}
			>
				{!state?.allStationEnd && (
					<Grid
						container
						spacing={3}
						className="justify-content-center"
					>
						<Grid item sm={10} md={10}>
							{cls && (
								<MeetingComp
									id={params.get("id")}
									key="dsfdsewr4ew"
									title={cls?.title}
									name={roleplayer.name}
								/>
							)}
						</Grid>
					</Grid>
				)}
			</Box>

			<div>
				{state?.delay && (
					<h3 style={{ marginTop: "300px", textAlign: "center" }}>
						Waiting for next candidate{" "}
						<BreakTimer ct={Date.now()} rt={0.5} />
					</h3>
				)}
				{/* break  time*/}
				{state?.break && (
					<h3 style={{ marginTop: "300px", textAlign: "center" }}>
						Exam will continue after{" "}
						<BreakTimer ct={Date.now()} rt={breakTime || 0} />
					</h3>
				)}
				{/* all station ended */}
				{state?.allStationEnd && (
					<div>
						<div className="text-center">
							<MoodIcon
								style={{ fontSize: "200px" }}
								mt="50px"
								color="success"
							/>
							<Typography variant="h2" mb="20px">
								No More Exams Left Today
							</Typography>
							<a href="/" style={{ textDecoration: "none" }}>
								<Button variant="contained" size="large">
									Back to dashboard
								</Button>
							</a>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default ExamV2R;
