import { useState, useEffect } from "react";
import MeetingComp from "../MeetingComp";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BreakTimer from "./BreakTimer";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Countdown from "react-countdown";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
let socket;
let ed;
let og;
function ExamV2R() {
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [roomId, setRoomId] = useState(params.get("id") || "");
	const [cls, setCls] = useState(null);
	const [cd, setCd] = useState(null);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [mark, setMark] = useState(true);
	const [mSubmited, setMSubmited] = useState(false);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const [breakTime, setBT] = useState(0);
	const [state, setState] = useState({
		break: false,
		delay: false,
		allStationEnd: false,
	});
	const [alert, setAlert] = useState({
		show: false,
		type: "success",
		msg: "",
	});
	const roleplayer = useSelector((state) => state.user);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: roleplayer.id });

			socket.emit("getClass", params.get("id"), (exam, notfound) => {
				if (!notfound) {
					if (exam?.pdf) {
						delete exam.pdf;
					}
					ed = exam.classDuration;
					setCls(exam);
					socket.emit("rejoin", roleplayer.id, async (data, err) => {
						console.log(data, err);
						if (data) {
							getCD(data.rt);
						}
					});
				} else {
					window.location.href = "/";
				}
			});
		});

		socket.on("delayStart", () => {
			setCls((old) => null);
			og = false;
			setState({
				...state,
				delay: true,
			});
		});

		socket.on("delayEnd", () => {
			setState({
				...state,
				delay: false,
			});
			getCD();
		});

		socket.on("breakStart", (bt) => {
			setCls((old) => null);
			setBT((old) => bt);
			og = false;
			setState({
				...state,
				break: true,
			});
		});
		socket.on("breakEnd", () => {
			setState({
				...state,
				break: false,
			});
			getCD();
		});

		socket.on("examsEnded", () => {
			og = false;
			setState({
				...state,
				allStationEnd: true,
			});
		});

		socket.on("stdInfo", (stdInfo) => {
			if (og) {
				setCd((old) => stdInfo);
				setAlert({
					show: true,
					type: "success",
					msg: "Candidate connected",
				});
			}
		});
		socket.on("candidateDisconnected", () => {
			if (og) {
				setAlert({
					show: true,
					type: "error",
					msg: "Candidate disconnected",
				});
			}
		});

		if (document.querySelector(".opendMenuIcon")) {
			document.querySelector(".opendMenuIcon").click();
		}
		return () => {
			socket.disconnect();
		};
	}, []);

	const getCD = (time) => {
		if (!time) {
			setRemainingTime((old) => ed);
		} else {
			setRemainingTime((old) => time);
		}

		setCurrentgTime((old) => Date.now());
		setTimeout(() => {
			axios
				.post(process.env.REACT_APP_SERVER_URL + "/getCD", {
					id: params.get("id"),
				})
				.then((data) => {
					setCd((old) => data.data.cd);
					og = true;
					console.log("received cd", data.data.cd);
				});
		}, 1000);
	};

	return (
		<div
			style={{
				height: "90%",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			<Snackbar
				open={alert.show}
				autoHideDuration={6000}
				onClose={() => {
					setAlert({
						msg: "",
						type: "success",
						show: false,
					});
				}}
			>
				<Alert severity={alert.type} sx={{ mb: 2 }}>
					{alert.msg}
				</Alert>
			</Snackbar>
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
								<>
									<Typography
										variant="h4"
										align="right"
										pr="10px"
										mb="5px"
									>
										<>
											{remainingTIme ? (
												<>
													Remaining Time :
													<b pl="5px">
														<Countdown
															key={currentTime}
															date={
																currentTime +
																remainingTIme *
																	60 *
																	1000
															}
															renderer={
																TimeRenderer
															}
														></Countdown>
													</b>
													min
												</>
											) : (
												"Not started "
											)}
										</>
									</Typography>
									<MeetingComp
										id={params.get("id")}
										key="dsfdsewr4ew"
										title={cls?.title}
										name={roleplayer.name}
									/>
									{cd && (
										<div>
											<Typography variant="h4">
												Candidate : <b>{cd.cd.name}</b>
											</Typography>
										</div>
									)}
								</>
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
								<Button
									variant="contained"
									component="label"
									className="BTN"
									size="large"
								>
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

function TimeRenderer({ minutes, seconds }) {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
}
