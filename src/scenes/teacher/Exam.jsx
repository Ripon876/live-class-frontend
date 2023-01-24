import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Countdown from "react-countdown";

import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import CandidateInfo from "./start-exam/CandidateInfo";
import Mark from "./start-exam/Mark";

let socket;

function ExamE() {
	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [cls, setCls] = useState({});
	const [cd, setCd] = useState(null);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [mark, setMark] = useState(true);
	const [mSubmited, setMSubmited] = useState(false);
	const [onGoing, setOngoing] = useState(false);
	const [currentTime, setCurrentgTime] = useState(Date.now());

	const teacherId = useSelector((state) => state.user.id);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: teacherId });

			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
					console.log(cls);
					// breaker(cls.classDuration);
					setRemainingTime(cls.classDuration);
				} else {
					window.location.href = "/";
				}
			});
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const APP_ID = "0d85c587d13f40b39258dd698cd77421";
		let uid = String(Math.floor(Math.random() * 10000) + "_Examiner");
		let token = null;
		let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
		let roomId = params.get("id");

		if (!roomId) {
			roomId = "main";
		}
		let localTracks = [];
		let remoteUsers = {};

		let localScreenTracks;

		let joinRoomInit = async (rId) => {
			await client.join(APP_ID, rId, token, uid);

			client.on("user-published", async (user, mediaType) => {
				console.log("new user joined", user);

				remoteUsers[user.uid] = user;

				await client.subscribe(user, mediaType);

				if (mediaType === "video") {
					if (user.uid?.split("_")[1] === "Candidate") {
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
				}

				console.log("user left", user);
			});
		};

		let joinStream = async () => {
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

			localTracks[1].play(exRef.current);

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

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
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
														key={currentTime}
														date={
															currentTime +
															remainingTIme *
																60 *
																1000
														}
														renderer={TimeRenderer}
														onComplete={() => {
															endStation();
															console.log(
																"countdown ends"
															);
														}}
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
											<MicIcon
												sx={{ cursor: "pointer" }}
											/>
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
								<h3 className="text-success">Mark Submited</h3>
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
