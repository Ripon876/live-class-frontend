import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
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

function StartClassAsStudent() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const stdId = useSelector((state) => state.id);
	// for call

	const [me, setMe] = useState("");
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState("");
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [idToCall, setIdToCall] = useState(searchParams.get("id"));
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState("");
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	const [rerender, setRerender] = useState(false);

	// let callerPeer = ;
	// let receiverPeer =

	// const updatePeers = () => {
	// 	callerPeer = new Peer({
	// 		initiator: true,
	// 		trickle: false,
	// 		stream: stream,
	// 	});
	// 	receiverPeer = new Peer({
	// 		initiator: false,
	// 		trickle: false,
	// 		stream: stream,
	// 	});
	// };

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((5 * 60) / 100) * 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		setProgress(0);
	}, [callAccepted]);

	useEffect(() => {
		socket.on("me", (id) => {
			setMe(id);
		});

		socket.on("callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});

		socket.on("alreadyJoined", (data) => {
			console.log("already Joined this class . msg: ", data.msg);
		});
	}, []);

	useEffect(() => {
		axios
			.get(
				"http://localhost:5000/teacher/get-class/" +
					searchParams.get("id"),
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setCls({ ...data.data.cls });
				setIdToCall(data.data.cls._id);
			})
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
				// setTimeout(()=> {
				// 	callUser(idToCall);
				// },2000)
			});

		socket.emit("clsStarted", { clsId: stdId });
	};

	useEffect(() => {
		setTimeout(() => {
			startClass();
			// callUser(idToCall);
		}, 2000);
	}, []);

	useEffect(() => {
		callUser(idToCall);
	}, [stream]);

	const callUser = (id) => {
		const peer = new window.SimplePeer({
			initiator: true,
			trickle: false,
			stream: stream,
		});
		peer._debug = console.log;
		peer.on("signal", (data) => {
			console.log("calling teacher");

			socket.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name,
			});
		});
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream;
		});
		peer.on("close", () => {
			console.log("meeting closed");
			setCallEnded(true);
			// updatePeers();
		});
		socket.on("callAccepted", (signal) => {
			console.log("call callAccepted");
			setCallAccepted(true);
			peer.signal(signal);
		});

		connectionRef.current = peer;
	};

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new window.SimplePeer({
			initiator: false,
			trickle: false,
			stream: stream,
		});

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
			// updatePeers();
		});
		peer.signal(callerSignal);
		connectionRef.current = peer;
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
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
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="70vh"
			>
				{!clsStarted && (
					<div>
						<CircularProgress
							size="100px"
							mt="50px"
							color="success"
						/>
						<Typography variant="h3" mt="50px">
							' {cls.title} '
						</Typography>
						<Typography variant="h4" mb="20px">
							Class will be taken for : {cls.classDuration} min
						</Typography>
						<Typography variant="h2" mb="20px">
							Getting You In <MoodIcon />
						</Typography>
						{/*<Button
							variant="contained"
							size="large"
							onClick={startClass}
						>
							Launch
						</Button>*/}
					</div>
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
							{/*
								<div className="myId">
								<Button
									variant="contained"
									size="large"
									onClick={() => {
										console.log("clicked");
									callUser(idToCall);
									}}
								>
									Join
								</Button>
								<input
									id="filled-basic"
									value={idToCall}
									onChange={(e) =>
										setIdToCall(e.target.value)
									}
								/>
								<div className="call-button">
									{callAccepted && !callEnded ? (
										<button onClick={leaveCall}>
											End Call
										</button>
									) : (
										<button>Call</button>
									)}
									{idToCall}
								</div>
							</div>*/}
							{/*<div>
								{receivingCall && !callAccepted ? (
									<div className="caller">
										<h1>{name} is calling...</h1>
										<button onClick={answerCall}>
											Answer
										</button>
									</div>
								) : null}
							</div>*/}
						</div>
					</div>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsStudent;
