import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import Peer from "simple-peer";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import MoodIcon from "@mui/icons-material/Mood";

import "./style.css";

// let socket = io.connect("http://localhost:5000");
let socket;

function StartClassAsTeacher2() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const teacherId = useSelector((state) => state.id);
	const [clsEnd, setClsEnd] = useState(false);
	// for call
	const [calling, setCaling] = useState(false);
	const [myStream, setMyStream] = useState();
	const [peerId, setPeerId] = useState(searchParams.get("id"));
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const [onGoing, setOngoing] = useState(false);
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const callerRef = useRef(null);
	const [std, setStd] = useState({});

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		socket = io.connect("http://localhost:5000");

		socket.on("connect", () => {
			console.log("socket connected");
			socket.emit("setActive", { id: teacherId });
		});

		socket.on("allClassEnd", (text) => {
			console.log("classes end : ", text);
			setClsEnd(true);
		});
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((1 * 60) / 100) * 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	// useEffect(() => {
	// 	if (progress === 50 && onGoing) {
	// 		console.log("100 dfsdfd");
	// 		socket.emit("clsEnd", { stdId: std?.std?.id, clsId: cls?._id });
	// 	}
	// }, [progress]);

	useEffect(() => {
		const peer = new Peer(searchParams.get("id"));

		peer.on("open", (id) => {
			setPeerId(id);
		});
		console.log(peer);
		peer.on("call", (call) => {
			console.log("calling");

			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				currentUserVideoRef.current.srcObject = mediaStream;
				currentUserVideoRef.current.play();
				callerRef.current = call;
				// setCaling(true);
				// setMyStream(mediaStream);
				setOngoing(true);
				setProgress(0);
				call.answer(mediaStream);

				call.on("stream", function (remoteStream) {
					setStd(call.metadata);
					console.log("data : ", call.metadata);
					remoteVideoRef.current.srcObject = remoteStream;
					remoteVideoRef.current.play();
				});
			});
		});

		peerInstance.current = peer;
	}, []);

	// const answerCall = () => {
	// 	callerRef.current.answer(myStream);
	// 	setCaling(false);
	// 	setOngoing(true);
	// 	setProgress(0);
	// };

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
			.then(() => {
				// navigator.mediaDevices
				// 	.getUserMedia({ video: true, audio: true })
				// 	.then((stream) => {
				// 		currentUserVideoRef.current.srcObject = stream;
				// 		currentUserVideoRef.current.play();
				// 	});
			})
			.catch((err) => console.log("err :", err));
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			{onGoing && !clsEnd && (
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
				{!clsEnd ? (
					<div>
						{/* calling && (
						<Button
							variant="contained"
							size="large"
							onClick={answerCall}
						>
							Allow
						</Button>
					) */}

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
											{!onGoing && (
												<h3 className="watingText">
													Wating for student
												</h3>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				) : (
					<div>
						<div>
							<MoodIcon
								// size="100px"
								style={{ fontSize: "200px" }}
								mt="50px"
								color="success"
							/>
							<Typography variant="h2" mb="20px">
								No More Classes Left Today
							</Typography>
							<Link to="/" style={{ textDecoration: "none" }}>
								<Button variant="contained" size="large">
									Back to dashboard
								</Button>
							</Link>
						</div>
					</div>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher2;
