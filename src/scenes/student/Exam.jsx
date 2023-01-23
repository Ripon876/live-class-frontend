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
import { Peer } from "peerjs";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";

function ExamC() {
	const [mic, setMic] = useState(true);

	const cd = useRef(null);
	const ex = useRef(null);
	const rpRef = useRef(null);

	useEffect(() => {
		if (document.querySelector(".opendMenuIcon")) {
			document.querySelector(".opendMenuIcon").click();
		}

		const APP_ID = "0d85c587d13f40b39258dd698cd77421";

		let uid = String(Math.floor(Math.random() * 10000) + "_Candidate");
		let token = null;

		let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let roomId = urlParams.get("id");
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
					if (user.uid?.split("_")[1] === "Examiner") {
						user.videoTrack.play(ex.current);
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

		setTimeout(async () => {
			await leaveStream();
			console.log("closing");
		}, 40000);

		setTimeout(() => {
			joinStream();
		}, 5000);

		joinRoomInit(roomId);

		return async () => {
			await leaveStream();
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
			<Box sx={{ flexGrow: 1 }} className="px-3 mt-5 pt-5">
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
										STD 1
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
										{mic ? <MicIcon /> : <MicOffIcon />}
									</IconButton>
									<IconButton aria-label="delete">
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
												EXAM 1
											</Typography>
										</ListItemText>
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText primary="Remaining Time" />

										<ListItemText
											primary={
												<Countdown
													key={Date.now()}
													date={
														Date.now() + 300 * 1000
													}
												/>
											}
											style={{ textAlign: "right" }}
										/>
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
						<div>
							<Card className="mb-2" style={{ cursor: "normal" }}>
								<div className={`video cd-video large-video `}>
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

						<div className="mt-5">
							<div>
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
						</div>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default ExamC;
