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
import { AgoraVideoPlayer } from "agora-rtc-react";

function ExamR() {
	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);

	useEffect(() => {
		const APP_ID = "0d85c587d13f40b39258dd698cd77421";
		let uid = String(Math.floor(Math.random() * 10000) + "_Roleplayer");
		let token = null;
		let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let roomId = urlParams.get("id");

		if (!roomId) {
			window.location.href = "/";
		}

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
					} else {
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
				console.log("user left", user);
			});
		};

		let joinStream = async () => {
			localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

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

		setTimeout(() => {
			joinStream();
		}, 5000);

		joinRoomInit(roomId);

		return async () => {
			await leaveStream();
		};
	}, []);

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
						</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default ExamR;
