import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Typography from "@mui/material/Typography";
import Countdown from "react-countdown";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import CandidateInfo from "./start-exam/CandidateInfo";
import Mark from "./start-exam/Mark";
import BreakTimer from "./BreakTimer";

let socket;
let uid;
function ExamE() {
	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);
	const tm = useRef(null);
	const ls = useRef(null);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [mic, setMic] = useState(true);
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
	const teacherId = useSelector((state) => state.user.id);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: teacherId });

			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
					setRemainingTime(cls.classDuration);
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
			uid = String(Math.floor(Math.random() * 50000) + "_Examiner");
			setState({
				...state,
				delay: false,
			});
		});

		socket.on("breakStart", (bt) => {
			setBT((old) => bt);
			setState({
				...state,
				break: true,
			});
			endStation();
		});
		socket.on("breakEnd", () => {
			uid = String(Math.floor(Math.random() * 50000) + "_Examiner");
			setState({
				...state,
				break: false,
			});
		});

		socket.on("examsEnded", () => {
			ls.current();
			setState({
				...state,
				allStationEnd: true,
			});

			console.log("= = = = = = = = = = = =");
			console.log("= = = = = = = = = = = =");
			console.log("exams Ended");
			console.log("= = = = = = = = = = = =");
			console.log("= = = = = = = = = = = =");
			return;
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
		uid = String(Math.floor(Math.random() * 50000) + "_Examiner");
		let token = null;
		let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
		let roomId = params.get("id");

		if (!roomId) {
			roomId = "main";
		}
		let localTracks = [];
		let remoteUsers = {};

		let joinRoomInit = async (rId) => {
			await client.join(APP_ID, rId, token, uid);
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
			exRef.current.innerHTML = "";
			localTracks[1].play(exRef.current);
			await client.publish([localTracks[0], localTracks[1]]);

			client.on("user-published", async (user, mediaType) => {
				console.log("new user joined", user);

				remoteUsers[user.uid] = user;

				await client.subscribe(user, mediaType);

				if (mediaType === "video") {
					if (user.uid?.split("_")[1] === "Candidate") {
						cdRef.current.innerHTML = "";
						user.videoTrack.play(cdRef.current);

						socket.emit("rejoin", teacherId, async (data, err) => {
							console.log(data, err);
							if (data) {
								setOngoing(true);
								setCurrentgTime(Date.now());
								setRemainingTime(data.rt);
							}
						});

						socket.emit(
							"newStationStarted",
							params.get("id"),
							(data) => {
								console.log(data);
								setCd(data);
							}
						);
					} else if (user.uid?.split("_")[1] === "Roleplayer") {
						rpRef.current.innerHTML = "";
						user.videoTrack.play(rpRef.current);
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
				if (user.uid?.split("_")[1] === "Candidate") {
					endStation();
					cdRef.current.innerHTML = `<h3 classname="watingText" 
					style="position: absolute; 
					    top: 50%;
    					left: 50%;
    					transform: translate(-50%, -50%);
						">Waiting for Candidate</h3>`;
				} else if (user.uid?.split("_")[1] === "Roleplayer") {
					rpRef.current.innerHTML = "";
				}

				console.log("user left", user);
			});
		};

		let joinStream = async () => {
			// await client.publish([localTracks[0], localTracks[1]]);
		};

		let leaveStream = async () => {
			for (let i = 0; localTracks.length > i; i++) {
				await localTracks[i].stop();
				await localTracks[i].close();
			}
			await client.unpublish([localTracks[0], localTracks[1]]);
			await client.leave();
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
		setMark(true);
		setMSubmited(false);
		setOngoing(false);
	};

	const hideDelay = () => {
		// setState({
		// 	...state,
		// 	delay: false,
		// });
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
								{cls?.roleplayer && (
									<div className="video rpVideo">
										<div>
											<div
												id="examiner-video"
												ref={rpRef}
											></div>

											<h2>Rp</h2>
										</div>
									</div>
								)}

								<div
									className="video myVideo"
									style={{ zIndex: 9999 }}
								>
									<div className="h-100">
										<div
											id="examiner-video"
											ref={exRef}
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
								<CandidateInfo og={true} cdn={cd?.name} />
							)}
							{mSubmited && onGoing && (
								<h3 className="text-success">
									Result Submited
								</h3>
							)}

							{mark && cd && onGoing && (
								<Mark
									list={cls?.checklist}
									sm={setMark}
									ms={setMSubmited}
									cId={cd.id}
									eId={cls._id}
								/>
							)}
						</div>
					</div>
				</div>
			</Box>

			{/* delay time  */}
			{state?.delay && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					Waiting for next candidate{" "}
					<BreakTimer ct={Date.now()} rt={0.5} delay ss={hideDelay} />
				</h3>
			)}

			{/* break  time*/}
			{state?.break && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					Exam will continue after{" "}
					<BreakTimer ct={Date.now()} rt={breakTime} />
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

export default ExamE;

function TimeRenderer({ minutes, seconds }) {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
}
