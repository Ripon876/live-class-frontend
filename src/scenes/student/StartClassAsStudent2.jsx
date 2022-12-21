import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MoodIcon from "@mui/icons-material/Mood";
import LinearProgress from "@mui/material/LinearProgress";

import "./style.css";

let socket = io.connect("http://localhost:5000");

function StartClassAsStudent2() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const stdId = useSelector((state) => state.id);
	const [onGoing, setOngoing] = useState(false);
	// for call

	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const [clsId, setClsId] = useState(searchParams.get("id"));
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			if (progress === 100) {
				clearInterval(timer);
			}

			setProgress((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((1 * 60) / 100) * 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);





	useEffect(() => {

console.log('stdId : ', stdId)

		socket.on("connect", () => {
			console.log("socket connected");
			socket.emit("setActive", { id: stdId });
		});

		socket.on("nextClass", (id) => {
			console.log("next class Id : ", id);

call(id); // calling next teacher
 

		});

		socket.on("allClassEnd", (text) => {
			console.log("classes end : ", text);
		});
	}, []);


// useEffect(() => {
// 		if (progress === 10 && onGoing) {
// 			console.log("100 dfsdfd");

// 		}
// 	}, [progress]);


	useEffect(() => {
		const peer = new Peer();

		peer.on("open", (id) => {
			setPeerId(id);
		});

		peer.on("call", (call) => {
			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				currentUserVideoRef.current.srcObject = mediaStream;
				currentUserVideoRef.current.play();
				call.answer(mediaStream);
				call.on("stream", function (remoteStream) {
					remoteVideoRef.current.srcObject = remoteStream;
					remoteVideoRef.current.play();
				});
			});
		});

		peerInstance.current = peer;

		return () => {
			console.log("component unmount");
		};
	}, []);

	const call = (remotePeerId) => {
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			currentUserVideoRef.current.srcObject = mediaStream;
			currentUserVideoRef.current.play();

			let options = {
				metadata: {
					std: { id: stdId },
				},
			};
			const call = peerInstance.current.call(
				remotePeerId,
				mediaStream,
				options
			);

			console.log("calling teacher");

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
				setOngoing(true);
				setProgress(0);
				console.log("call accepted");
			});
		});
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			{onGoing && (
				<LinearProgress
					variant="determinate"
					color="success"
					value={progress}
				/>
			)}

			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
			>
				<Typography variant="h3" mt="150px">
					{peerId}
				</Typography>

				<input
					type="text"
					value={remotePeerIdValue}
					onChange={(e) => setRemotePeerIdValue(e.target.value)}
				/>
				<button onClick={() => call(remotePeerIdValue)}>Call</button>

				<div>
					<div className="container">
						<div className="video-container">
							<div className="video myVideo">
								<div>
									<video
										playsInline
										muted
										ref={currentUserVideoRef}
										autoPlay
									/>

									<h2>You</h2>
								</div>
							</div>
							<div className="video otherVideo">
								<video
									playsInline
									ref={remoteVideoRef}
									autoPlay
								/>
							</div>
						</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default StartClassAsStudent2;
