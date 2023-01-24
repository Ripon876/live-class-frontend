import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import BreakTimer from "./BreakTimer";

let socket;
function ExamR() {
	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);
	const tm = useRef(null);
	const ls = useRef(null);
	const [mic, setMic] = useState(true);
	const [cd, setCd] = useState(null);
	const [cls, setCls] = useState({});
	const [remainingTIme, setRemainingTime] = useState(0);
	const [onGoing, setOngoing] = useState(false);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const rolplayerId = useSelector((state) => state.user.id);

	const [state, setState] = useState({
		break: false,
		delay: false,
		allStationEnd: false,
	});

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: rolplayerId });
			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
				} else {
					window.location.href = "/";
				}
			});
		});

		socket.on("delayStart", () => {
			setState({
				...state,
				delay: true,
			});
			endStation();
		});

		socket.on("delayEnd", () => {
			setState({
				...state,
				delay: false,
			});
		});

		socket.on("examsEnded", () => {
			ls.current();
			setState({
				...state,
				allStationEnd: true,
			});
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (document.querySelector(".opendMenuIcon")) {
			document.querySelector(".opendMenuIcon").click();
		}

		const APP_ID = "0d85c587d13f40b39258dd698cd77421";
		let uid = String(Math.floor(Math.random() * 10000) + "_Roleplayer");
		let token = null;
		let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

		let roomId = params.get("id");

		if (!roomId) {
			window.location.href = "/";
		}

		if (!roomId) {
			roomId = "main";
		}
		let localTracks = [];
		let remoteUsers = {};

		let joinRoomInit = async (rId) => {
			await client.join(APP_ID, rId, token, uid);

			client.on("user-published", async (user, mediaType) => {
				console.log("new user joined", user);
				remoteUsers[user.uid] = user;
				await client.subscribe(user, mediaType);

				if (mediaType === "video") {
					if (user.uid?.split("_")[1] === "Candidate") {
						cdRef.current.innerHTML = "";
						user.videoTrack.play(cdRef.current);
						setOngoing(true);
						socket.emit(
							"rejoin",
							rolplayerId,
							async (data, err) => {
								console.log(data, err);
								if (data) {
									setRemainingTime(data.rt);
								}
							}
						);

						socket.emit("getCd", params.get("id"), (data) => {
							console.log(data);
							setCd(data);
						});
					} else if (user.uid?.split("_")[1] === "Examiner") {
						exRef.current.innerHTML = "";
						user.videoTrack.play(exRef.current);
					}
				}

				if (mediaType === "audio") {
					user.audioTrack.play();
				}
			});
			client.on("user-joined", async (user) => {
				console.log("user joined", user);
			});
			client.on("user-left", async (user) => {
				if (user.uid?.split("_")[1] === "Examiner") {
					exRef.current.innerHTML = "";
				} else if (user.uid?.split("_")[1] === "Candidate") {
					cdRef.current.innerHTML = `<h3 classname="watingText" 
					style="position: absolute; 
					    top: 50%;
    					left: 50%;
    					transform: translate(-50%, -50%);
						">Wating for Candidate</h3>`;
					endStation();
				}

				console.log("user left", user);
			});
		};

		let joinStream = async () => {
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
			rpRef.current.innerHTML = "";

			localTracks[1].play(rpRef.current);

			await client.publish([localTracks[0], localTracks[1]]);
		};

		let leaveStream = async () => {
			for (let i = 0; localTracks.length > i; i++) {
				localTracks[i].stop();
				localTracks[i].close();
			}
			client.leave();
			await client.unpublish([localTracks[0], localTracks[1]]);
		};
		let toggleMic = async () => {
			setMic((old) => !old);
			console.log("setting mic");
			if (localTracks[0].muted) {
				await localTracks[0].setMuted(false);
			} else {
				await localTracks[0].setMuted(true);
			}
		};
		ls.current = leaveStream;
		tm.current = toggleMic;
		setTimeout(() => {
			joinStream();
		}, 5000);

		joinRoomInit(roomId);

		return async () => {
			await leaveStream();
		};
	}, []);

	const endStation = () => {
		setCd(null);
		setOngoing(false);
	};

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
				sx={{
					display:
						!state?.delay && !state?.break && !state?.allStationEnd
							? "block"
							: "none",
				}}
			>
				<div>
					<div>
						<div
							className="container"
							style={{
								display: "block",
							}}
						>
							<div className="video-container">
								<Typography
									variant="h4"
									align="right"
									pr="10px"
									mb="5px"
									style={{
										opacity: 1,
									}}
								>
									<>
										{cd && remainingTIme && onGoing ? (
											<>
												Remainig Time :
												<b pl="5px">
													<Countdown
														key={Date.now()}
														date={
															Date.now() +
															remainingTIme *
																60 *
																1000
														}
														renderer={TimeRenderer}
													></Countdown>
												</b>
												min
											</>
										) : (
											"Not started "
										)}
									</>
								</Typography>

								<div className="video rpVideo">
									<div>
										<div
											id="examiner-video"
											ref={exRef}
										></div>

										<h2>Ex</h2>
									</div>
								</div>

								<div
									className="video myVideo"
									style={{ zIndex: 9999 }}
								>
									<div className="h-100">
										<div
											id="examiner-video"
											ref={rpRef}
										></div>
										<h2>You</h2>
										<div
											style={{
												position: "absolute",
												right: 0,
												bottom: "10px",
												display: "flex",
												alignItems: "end",
											}}
										>
											{mic ? (
												<MicIcon onClick={tm.current} />
											) : (
												<MicOffIcon
													onClick={tm.current}
												/>
											)}
										</div>
									</div>
								</div>
								<div
									ref={cdRef}
									className="video otherVideo"
									style={{
										border: "5px solid #0e131e",
										borderRadius: "10px",
									}}
								>
									<h3 className="watingText">
										Wating for Candidate
									</h3>
								</div>
							</div>
							{cd && onGoing && (
								<div>
									<Typography variant="h4">
										Currently Joined Candidate :{" "}
										<b>{cd?.name}</b>
									</Typography>
								</div>
							)}
						</div>
					</div>
				</div>
			</Box>

			{/* delay time  */}
			{state?.delay && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					Taking you to next station{" "}
					<BreakTimer ct={Date.now()} rt={0.5} />
				</h3>
			)}
			{/* break  time*/}
			{state?.break && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					Exam will continue after{" "}
					<BreakTimer ct={Date.now()} rt={cls?.classDuration} />
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
	);
}

export default ExamR;

function TimeRenderer({ minutes, seconds }) {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
}
