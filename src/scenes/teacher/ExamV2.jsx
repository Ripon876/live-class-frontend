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
import CandidateInfo from "./start-exam/CandidateInfo";
import Mark from "./start-exam/Mark";
import axios from "axios";

let socket;
function ExamV2E() {
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [roomId, setRoomId] = useState(params.get("id") || "");
	const [cls, setCls] = useState({});
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
	const teacher = useSelector((state) => state.user);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: teacher.id });

			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					if (cls?.pdf) {
						delete cls.pdf;
					}
					setCls(cls);
					setRemainingTime(cls.classDuration);

					getCD();
				} else {
					window.location.href = "/";
				}
			});

			socket.emit("rejoin", teacher.id, async (data, err) => {
				if (data) {
					setOngoing(true);
					setCurrentgTime(Date.now());
					setRemainingTime(data.rt);
				}
			});
		});

		socket.on("delayStart", () => {
			setState({
				...state,
				delay: true,
			});
			setCd((old) => null);
			setMark((old) => true);
			setMSubmited((old) => false);
		});

		socket.on("delayEnd", () => {
			setState({
				...state,
				delay: false,
			});
			getCD();
		});

		socket.on("breakStart", (bt) => {
			setMSubmited((old) => false);
			setMark((old) => true);
			setCd((old) => null);
			setBT((old) => bt);
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
			setCd((old) => null);
			setState({
				...state,
				allStationEnd: true,
			});


		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const getCD = () => {
		setTimeout(() => {
			axios
				.post(process.env.REACT_APP_SERVER_URL + "/getCD", {
					id: params.get("id"),
				})
				.then((data) => {
					setCd((old) => data.data.cd);
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
							<MeetingComp
								id={params.get("id")}
								key="dsfdsewr4ew"
								title={cls?.title}
								name={teacher.name}
							/>
							{cd && (
								<div>
									<CandidateInfo og={true} cdn={cd.cd.name} />

									{mSubmited && (
										<h3 className="text-success">
											Result Submited
										</h3>
									)}

									{mark && (
										<Mark
											list={cls?.checklist}
											sm={setMark}
											ms={setMSubmited}
											cId={cd.cd._id}
											eId={cls?._id}
										/>
									)}
								</div>
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

export default ExamV2E;
