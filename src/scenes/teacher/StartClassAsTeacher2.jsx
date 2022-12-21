import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import Peer from "simple-peer";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

import "./style.css";

let socket = io.connect("http://localhost:5000");

function StartClassAsTeacher2() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);

	// for call
	const [calling, setCaling] = useState(false);
	const [myStream, setMyStream] = useState();
	const [peerId, setPeerId] = useState(searchParams.get("id"));
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const callerRef = useRef(null);

	useEffect(() => {
		const peer = new Peer(searchParams.get("id"));

		peer.on("open", (id) => {
			setPeerId(id);
		});
console.log(peer)
		peer.on("call", (call) => {

console.log('calling')


			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				currentUserVideoRef.current.srcObject = mediaStream;
				currentUserVideoRef.current.play();
				callerRef.current = call;
				setCaling(true);
				setMyStream(mediaStream);
				// call.answer(mediaStream);

				call.on("stream", function (remoteStream) {
					remoteVideoRef.current.srcObject = remoteStream;
					remoteVideoRef.current.play();
				});
			});
		});

		peerInstance.current = peer;
	}, []);

	const answerCall = () => {
		callerRef.current.answer(myStream);
		setCaling(false);
	};

	// fetching class
	useEffect(() => {
		axios
			.get(
				"http://localhost:5000/teacher/get-class/" +
					searchParams.get("id"),
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => setCls({ ...data.data.cls }))
			.catch((err) => console.log("err :", err));
	}, []);

	const startClass = () => {
		setClsStarted(true);
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
			>
				{calling && (
					<Button
						variant="contained"
						size="large"
						onClick={answerCall}
					>
						Allow
					</Button>
				)}

				{!clsStarted && (
					<>
						<Typography variant="h3" mt="150px">
							' {cls.title} '
						</Typography>
						<Typography variant="h4" mb="20px">
							Each class will be : {cls.classDuration} min
						</Typography>

						{cls.hasToJoin !== 0 && (
							<Button
								variant="contained"
								size="large"
								onClick={startClass}
							>
								Start Class
							</Button>
						)}
					</>
				)}

				{clsStarted && (
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
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher2;
