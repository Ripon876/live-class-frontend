import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
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

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);

	// for call

	const [me, setMe] = useState("");
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState("");
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [idToCall, setIdToCall] = useState("");
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState("");
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();
	const [progress, setProgress] = useState(0);

	const [currentPeer, setCurrentPeer] = useState(0);

	const myPeer = useRef();

	let peers = {};

	useEffect(() => {
		socket.on("me", (id) => {
			setMe(id);
		});
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((2 * 60) / 100) * 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		setProgress(0);
	}, [callAccepted]);

	useEffect(() => {
		socket.on("callUser", (data) => {




console.log('calling');




			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});
	}, []);

	useEffect(() => {
		if (progress === 100) {
			leaveCall();
		}
	}, [progress]);

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new window.SimplePeer({
			initiator: false,
			trickle: false,
			config: {
				iceServers: [
					{
						urls: "stun:stun.stunprotocol.org",
					},
				],
			},
			stream: stream,
		});
		peer._debug = console.log;
		peer.on("signal", (data) => {
			console.log("incoming request");
			socket.emit("answerCall", { signal: data, to: caller });
		});
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream;
		});

		peer.on("close", () => {
			console.log("meeting closed");
			setCallEnded(true);
		});
		peer.signal(callerSignal);
		connectionRef.current = peer;
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
	};

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
		document.querySelector(".MuiButtonBase-root").click();
		setClsStarted(true);

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				console.log(stream);
				setStream(stream);
				myVideo.current.srcObject = stream;
			})
			.then(() => {
				axios
					.get(
						"http://localhost:5000/teacher/starting-class/" +
							searchParams.get("id"),
						{
							headers: {
								Authorization: `Bearer ${cookies.token}`,
							},
						}
					)
					.then((data) => console.log(data.data.msg))
					.catch((err) => console.log("err :", err));
			});

		socket.emit("clsStarted", { clsId: cls._id });
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			{callAccepted && !callEnded && (
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
				{receivingCall && !callAccepted && (
					<Typography variant="h3" mt="150px">
						'Student wants to join.'
						<Button
							variant="contained"
							size="large"
							onClick={answerCall}
							ml="40px"
						>
							Alllow
						</Button>
					</Typography>
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
								<div
									className={
										callAccepted && !callEnded
											? "video myVideo"
											: "video"
									}
								>
									<div>
										<video
											playsInline
											muted
											ref={myVideo}
											autoPlay
										/>

										<h2>You</h2>
									</div>
								</div>

								{callAccepted && !callEnded ? (
									<div className="video otherVideo">
										<video
											playsInline
											ref={userVideo}
											autoPlay
										/>
									</div>
								) : null}
							</div>
						</div>

						{callAccepted && !callEnded && (
							<div>
								<Button
									variant="contained"
									size="large"
									onClick={leaveCall}
									ml="40px"
								>
									End
								</Button>
							</div>
						)}
					</div>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
