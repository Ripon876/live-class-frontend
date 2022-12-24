import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import Countdown from "react-countdown";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MoodIcon from "@mui/icons-material/Mood";
import LinearProgress from "@mui/material/LinearProgress";

import "./style.css";

// let socket = io.connect("http://localhost:5000");
let socket;

function StartClassAsStudent2() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const stdId = useSelector((state) => state.id);
	const [onGoing, setOngoing] = useState(false);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	// for call

	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const [clsId, setClsId] = useState(searchParams.get("id"));
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		socket = io.connect("http://localhost:5000");

		console.log("stdId : ", stdId);

		socket.on("connect", () => {
			console.log("socket connected");
			socket.emit("setActive", { id: stdId });
			socket.emit("getClass", searchParams.get("id"), (cls) => {
				setCls(cls);
				setRemainingTime(cls.classDuration);
			});
		});

		/*		socket.on("nextClass", (id) => {
			console.log("next class Id : ", id);

			console.log("moving to next one");
			call(id); // calling next teacher
		});

		socket.on("allClassEnd", (text) => {
			console.log("classes end : ", text);
			setClsEnd(true);
		});
		socket.on("checkingClass", (text) => {
			console.log("classes end : ", text);
			setClsEnd(true);
		});*/

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (progress === 100) {
				clearInterval(timer);
			}

			setProgress((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((cls.classDuration * 60) / 100) * 1000);

		return () => {
			clearInterval(timer);
		};
	}, [cls]);

	useEffect(() => {
		if (progress === 100 && onGoing) {
			console.log("100 dfsdfd");
			socket.emit("clsEnd", { stdId: stdId, clsId: clsId }, (res) => {
				if (res.type === "joinNextClass") {
					console.log("next class is their ,id : ", res.id);
					call(res.id);
					setClsId(res.id);
				}

				if (res.type === "allClassEnd") {
					console.log("no more cls , msg: ", res.text);
					setClsEnd(true);
				}
			});
		}
	}, [progress]);

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
				setCurrentgTime(Date.now());
				setClsStarted(true);
				console.log("call accepted");
			});
		});
	};

	const TimeRenderer = ({ minutes, seconds }) => {
		return (
			<span>
				{minutes < 10 ? "0" + minutes : minutes}:
				{seconds < 10 ? "0" + seconds : seconds}
			</span>
		);
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
						{!clsStarted && (
							<>
								<Typography variant="h3" mt="150px">
									' {cls?.title} '
								</Typography>

								<Typography variant="h4">
									Subject : {cls?.subject}
								</Typography>
								<Typography variant="h4" mb="20px">
									Class will be : {cls?.classDuration} min
								</Typography>

								<Button
									variant="contained"
									size="large"
									onClick={() => call(cls._id)}
								>
									Join
								</Button>
							</>
						)}

						{/* <Typography variant="h3" mt="150px">
							{peerId}
						</Typography>

						<input
							type="text"
							value={remotePeerIdValue}
							onChange={(e) =>
								setRemotePeerIdValue(e.target.value)
							}
						/>
						<button onClick={() => call(remotePeerIdValue)}>
							Call
						</button> */}
						
							<div style={{ display: clsStarted ? 'block' : 'none'}}>
								<div className="container">
									<div className="video-container">
										{remainingTIme !== 0 && (
											<Typography
												variant="h4"
												align="right"
												pr="10px"
												mb="5px"
											>
												Remainig Time :{" "}
												<b pl="5px">
													<Countdown
														date={
															currentTime +
															remainingTIme *
																60 *
																1000
														}
														renderer={TimeRenderer}
													/>{" "}
												</b>
												min
											</Typography>
										)}
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
													Joining
												</h3>
											)}
										</div>
									</div>
									<div>
										<Typography variant="h4">
											Ongoing : <b>{cls?.title}</b>
										</Typography>
										<Typography variant="h4">
											Subject : <b>{cls?.subject}</b>
										</Typography>
										<Typography variant="h4">
											Teacher :{" "}
											<b>{cls?.teacher?.name}</b>
										</Typography>
									</div>
								</div>
							</div>
						
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

export default StartClassAsStudent2;
