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


import './style.css';

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

	const [rerender, setRerender] = useState(false);

	let callerPeer = new Peer({
		initiator: true,
		trickle: false,
		stream: stream,
	});
	let receiverPeer = new Peer({
		initiator: false,
		trickle: false,
		stream: stream,
	});

	const updatePeers = () => {
		callerPeer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream,
		});
		receiverPeer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream,
		});
	};

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setStream(stream);
				myVideo.current.srcObject = stream;
			});

		socket.on("me", (id) => {
			setMe(id);
		});

		socket.on("callUser", (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});
	}, []);

	const callUser = (id) => {
		const peer = callerPeer;
		peer._debug = console.log;
		peer.on("signal", (data) => {
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
			updatePeers();
		});
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});

		connectionRef.current = peer;
	};

	const answerCall = () => {
		setCallAccepted(true);
		const peer = receiverPeer;

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
			updatePeers();
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
				console.log(stream)
				setStream(stream);
				myVideo.current.srcObject = stream;
			});

	socket.emit('clsStarted', {clsId: cls._id});


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
				{!clsStarted && (
					<>
						<Typography variant="h3" mt="150px">
							' {cls.title} '
						</Typography>
						<Typography variant="h4" mb="20px">
							Each class will be : {cls.classDuration} min
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={startClass}
						>
							Launch
						</Button>
					</>
				)}




 { clsStarted && <div>
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
							<video playsInline ref={userVideo} autoPlay />
						</div>
					) : null}
				</div>
				<div className="myId">
					<input
						id="filled-basic"
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ marginBottom: "20px" }}
					/>
					<h4>{me}</h4>
					<CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
						<button>Copy ID</button>
					</CopyToClipboard>

					<input
						id="filled-basic"
						value={idToCall}
						onChange={(e) => setIdToCall(e.target.value)}
					/>
					<div className="call-button">
						{callAccepted && !callEnded ? (
							<button onClick={leaveCall}>End Call</button>
						) : (
							<button onClick={() => callUser(idToCall)}>
								Call
							</button>
						)}
						{idToCall}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div className="caller">
							<h1>{name} is calling...</h1>
							<button onClick={answerCall}>Answer</button>
						</div>
					) : null}
				</div>
			</div>
</div> }



			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
