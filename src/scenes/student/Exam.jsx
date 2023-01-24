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
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import io from "socket.io-client";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import PDFViewer from "./start-class/PDFViewer";
import BreakTimer from "./start-class/BreakTimer";

let socket;

function ExamC() {
	const stdId = useSelector((state) => state.user.id);
	const [std, setStd] = useState(null);
	const [mic, setMic] = useState(true);
	const [note, setNote] = useState(false);
	const [cls, setCls] = useState(null);
	const [readed, setReaded] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const [onGoing, setOngoing] = useState(false);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const [state, setState] = useState({
		nextStation: "",
		break: false,
		delay: false,
		allStationEnd: false,
	});

	const [searchParams, setSearchParams] = useSearchParams();
	const [remainingTIme, setRemainingTime] = useState(0);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const cd = useRef(null);
	const ex = useRef(null);
	const rpRef = useRef(null);
	const ls = useRef(null);
	const se = useRef(null);
	const tm = useRef(null);
	const joinStation = useRef(null);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: stdId });

			socket.emit("getClass", params.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
				} else {
					window.location.href = "/";
				}
			});
			socket.emit("getStdDetails", stdId, (data) => {
				setStd(data);
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

		socket.on("examIdCd", (id) => {
			setSearchParams({ id: id });

			socket.emit("getClass", id, (cls, notfound) => {
				if (!notfound) {
					setCls(cls);

					joinStation.current(id);
				} else {
					window.location.href = "/";
				}
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

		let uid = String(Math.floor(Math.random() * 10000) + "_Candidate");
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

			client.on("user-published", async (user, mediaType) => {
				console.log("new user joined", user);
				remoteUsers[user.uid] = user;
				await client.subscribe(user, mediaType);
				if (mediaType === "video") {
					if (user.uid?.split("_")[1] === "Examiner") {
						ex.current.innerHTML = "";
						user.videoTrack.play(ex.current);

						// socket.emit("getClass", rId, (cls, notfound) => {
						// 	if (!notfound) {
						// 		setCls(cls);
						// 	} else {
						// 		window.location.href = "/";
						// 	}
						// });

						socket.emit("rejoin", stdId, async (data, err) => {
							console.log(data, err);
							if (data) {
								setOngoing(true);
								setCurrentgTime(Date.now());
								setRemainingTime(data.rt);
							}
						});
					} else if (user.uid?.split("_")[1] === "Roleplayer") {
						console.log(" = = = = = = = =  = = = =");
						console.log(" roleplayer joining ");
						console.log(" = = = = = = = =  = = = =");

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
				console.log("user left", user);
				if (user.uid?.split("_")[1] === "Examiner") {
					ex.current.innerHTML = "";
				} else if (user.uid?.split("_")[1] === "Roleplayer") {
					rpRef.current.innerHTML = "";
				}
			});
		};

		let joinStream = async () => {
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
			cd.current.innerHTML = "";
			localTracks[1].play(cd.current);
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

		se.current = joinStream;
		joinStation.current = joinRoomInit;
		joinRoomInit(roomId);

		return async () => {
			await leaveStream();
		};
	}, []);

	const endStation = async () => {
		await ls.current();
		setOngoing(false);
		setCls(null);
		localStorage.removeItem("pdf");
	};

	useEffect(() => {
		if (cls) {
			setTimeout(
				() => {
					se.current();
				},
				cls?.pdf ? cls?.pdf?.visibleFor * 60 * 1000 + 1000 : 5000
			);
		}
	}, [cls]);

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
				<Grid container spacing={3} className="justify-content-center">
					<Grid item sm={4} md={3}>
						<div>
							<Card className="mb-2" style={{ cursor: "normal" }}>
								<div className={`video cd-video `}>
									<div className="h-100 w-100">
										<div
											ref={cd}
											className="w-100 h-100 bg-black"
										></div>
									</div>
								</div>
								<CardContent className="p-2 ps-4">
									<Typography
										gutterBottom
										variant="h3"
										component="div"
										className="m-0"
									>
										{std?.name}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
									>
										Candidate
									</Typography>
								</CardContent>
							</Card>

							<Card className="mb-2">
								<ButtonGroup
									className="justify-content-around w-100 py-1"
									variant="contained"
									aria-label="Disabled elevation buttons"
								>
									<IconButton aria-label="delete">
										{mic ? (
											<MicIcon onClick={tm.current} />
										) : (
											<MicOffIcon onClick={tm.current} />
										)}
									</IconButton>
									<IconButton
										aria-label="delete"
										onClick={() => setNote(!note)}
									>
										<NoteAltIcon />
									</IconButton>
								</ButtonGroup>
							</Card>
							<Card className="mb-3">
								<List
									component="nav"
									aria-label="secondary mailbox folder"
								>
									<ListItem>
										<ListItemText>
											<Typography
												gutterBottom
												variant="h3"
												component="div"
												className="m-0"
											>
												{cls?.title}
											</Typography>
										</ListItemText>
									</ListItem>
									{cls?.pdf && (
										<>
											<Divider />
											<ListItem>
												<ListItemText
													primary="Reading Time"
													secondary={`${cls?.pdf?.visibleFor} minute`}
												/>
												{readed && (
													<ListItemText
														primary={
															<CheckCircleIcon color="success" />
														}
														style={{
															textAlign: "right",
														}}
													/>
												)}
											</ListItem>
										</>
									)}
									<Divider />
									<ListItem>
										<ListItemText primary="Remaining Time" />
										{onGoing && remainingTIme && (
											<>
												{cls?.pdf && readed && (
													<ListItemText
														primary={
															<Countdown
																key={
																	currentTime
																}
																date={
																	currentTime +
																	remainingTIme *
																		60 *
																		1000
																}
																renderer={
																	TimeRenderer
																}
															/>
														}
														style={{
															textAlign: "right",
														}}
													/>
												)}
												{!cls?.pdf && (
													<ListItemText
														primary={
															<Countdown
																key={
																	currentTime
																}
																date={
																	currentTime +
																	remainingTIme *
																		60 *
																		1000
																}
																renderer={
																	TimeRenderer
																}
																onComplete={() => {
																	endStation();
																	console.log(
																		"countdown ends"
																	);
																}}
															/>
														}
														style={{
															textAlign: "right",
														}}
													/>
												)}
											</>
										)}
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText
											secondary="There is 1 examiner"
											secondaryTypographyProps={{
												fontSize: "20px",
											}}
										/>
									</ListItem>
								</List>
							</Card>
						</div>
					</Grid>
					<Grid item sm={8} md={8}>
						<div
							style={{
								display: cls?.pdf && !readed ? "none" : "block",
							}}
						>
							<div>
								<Card
									className="mb-2"
									style={{ cursor: "normal" }}
								>
									<div
										className={`video cd-video large-video `}
									>
										<div className="h-100 w-100">
											<div
												className="w-100 h-100 bg-black"
												ref={ex}
											></div>
										</div>
									</div>
									<CardContent className="p-2 ps-4">
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Examiner
										</Typography>
									</CardContent>
								</Card>
							</div>

							<div className="mt-3 d-flex">
								{cls?.roleplayer && (
									<div className="me-4">
										<Card
											className="mb-2"
											style={{
												cursor: "pointer",
												maxWidth: "250px",
											}}
										>
											<div
												className={`video cd-video  small-video`}
											>
												<div className="h-100 w-100">
													<div
														className="w-100 h-100 bg-black"
														ref={rpRef}
													></div>
												</div>
											</div>
											<CardContent className="p-2 ps-4">
												<Typography
													variant="body2"
													color="text.secondary"
												>
													Roleplayer
												</Typography>
											</CardContent>
										</Card>
									</div>
								)}
								<div
									style={{
										display: note ? "block" : "none",
									}}
									className="w-100"
								>
									<div className="form-group">
										<label htmlFor="note">Note</label>
										<textarea
											placeholder="Write note"
											className="form-control"
											rows="6"
											id="note"
										></textarea>
									</div>
								</div>
							</div>
						</div>

						<div>
							<div>
								{cls?.pdf && (
									<PDFViewer
										pdf={cls?.pdf?.file}
										vf={cls?.pdf?.visibleFor}
										ssp={setShowPdf}
										srd={setReaded}
										s={showPdf}
										eId={params.get("id")}
									/>
								)}
							</div>
						</div>
					</Grid>
				</Grid>
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

export default ExamC;

function TimeRenderer({ minutes, seconds }) {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
}
