import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
let socket;

function InspectExam() {
	const adminId = useSelector((state) => state.user.id);

	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [names, setNames] = useState({
		examiner: "",
		roleplayer: "",
		candidate: "",
		subject: "",
	});
	const [examsEnd, setExamsEnd] = useState(false);
	const [reload, setReload] = useState(false);

	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("allClsTaken", () => {
			setExamsEnd(true);
			setReload(false);
		});
		socket.on("cdChanging", () => {
			setReload(true);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const APP_ID = "0d85c587d13f40b39258dd698cd77421";
		let uid = String(Math.floor(Math.random() * 10000) + "_Admin");
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
					console.log("getting user data : ", user);

					if (user.uid?.split("_")[1] === "Candidate") {
						user.videoTrack.play(cdRef.current);
					} else if (user.uid?.split("_")[1] === "Examiner") {
						user.videoTrack.play(exRef.current);
					} else {
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
			});
		};

		let joinStream = async () => {
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

			// localTracks[1].play(exRef.current);

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
	return (
		<div>
			<div style={{ overflowY: "auto", maxHeight: "90%" }}>
				<Box component="div" width="90%" p="0 0 0 20px" align="center">
					<div>
						<div className="container">
							{!examsEnd && !reload && (
								<div className="align-items-center justify-content-center row video-container">
									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={exRef}
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

									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
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
									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={cdRef}
												></div>
											</div>
										</div>
										<CardContent className="p-2 ps-4">
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Candidate
											</Typography>
										</CardContent>
									</Card>
								</div>
							)}
							{examsEnd && <h4>Exam Ended</h4>}
						</div>

						<div>
							<Button
								variant="filled"
								sx={{
									mt: 1,
									ml: 2,
									boxShadow: 3,
								}}
								onClick={() => {
									window.location.href = `/host_exam`;
								}}
							>
								Back to states
							</Button>
						</div>
					</div>
				</Box>
			</div>
		</div>
	);
}

export default InspectExam;
