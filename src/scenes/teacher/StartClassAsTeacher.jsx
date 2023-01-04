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
import LinearProgress from "@mui/material/LinearProgress";
import MoodIcon from "@mui/icons-material/Mood";
import Roleplayer from "./Roleplayer";
import "./style.css";

let socket;

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const teacherId = useSelector((state) => state.id);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	// for call
	const [calling, setCaling] = useState(false);
	const [myStream, setMyStream] = useState();
	const [peerId, setPeerId] = useState(searchParams.get("id"));
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const [onGoing, setOngoing] = useState(false);
	const remoteVideoRef = useRef(null);

	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const rpPeerInstance = useRef(null);
	const callerRef = useRef(null);
	const [std, setStd] = useState({});

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: teacherId });
		});

		socket.on("allClassEnd", (text) => {
			// console.log("classes end : ", text);
			setClsEnd(true);
		});
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (progress === 110) {
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
		const peer = new Peer(searchParams.get("id"));
		const rp_peer = new Peer(searchParams.get("id") + "examiner");

		peer.on("open", (id) => {
			setPeerId(id);
		});
		// console.log(peer);
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
				setOngoing(true);
				setProgress(0);
				setCurrentgTime(Date.now());
				call.answer(mediaStream);

				call.on("stream", function (remoteStream) {
					// console.log("data : ", call.metadata);
					remoteVideoRef.current.srcObject = remoteStream;
					remoteVideoRef.current.play();
					// get joined student info
					socket.emit("getStudent", call.metadata.std.id, (std) => {
						setStd(std);
						// console.log(std);
						// check for roleplayer exists or not
						if (cls.roleplayer) {
							socket.emit(
								"addWithRoleplayer",
								std,
								searchParams.get("id")
							);
						}
					});
					socket.emit(
						"newClassStarted",
						call.metadata.std.id,
						searchParams.get("id")
					);
				});
			});
		});

		peerInstance.current = peer;
		rpPeerInstance.current = rp_peer;
	}, []);

	// fetching class
	useEffect(() => {
		axios
			.get(
				process.env.REACT_APP_SERVER_URL +
					"/teacher/get-class/" +
					searchParams.get("id"),
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setCls({ ...data.data.cls });
				setRemainingTime(data.data.cls.classDuration);
				// console.log("getting class using axios : ", data.data.cls);
			})
			.catch((err) => console.log("err :", err));
	}, []);

	const startClass = () => {
		setClsStarted(true);

		axios
			.get(
				process.env.REACT_APP_SERVER_URL +
					"/teacher/starting-class/" +
					searchParams.get("id"),
				{
					headers: {
						Authorization: `Bearer ${cookies.token}`,
					},
				}
			)
			.then((data) => {
				// console.log(data.data.msg)
			})
			.catch((err) => console.log("err :", err));
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
										{remainingTIme !== 0 && (
											<Typography
												variant="h4"
												align="right"
												pr="10px"
												mb="5px"
												style={{
													opacity: onGoing ? "1" : 0,
												}}
											>
												Remainig Time :
												<b pl="5px">
													<Countdown
														key={currentTime}
														date={
															currentTime +
															remainingTIme *
																60 *
																1000
														}
														renderer={TimeRenderer}
													/>
												</b>
												min
											</Typography>
										)}
										{cls.roleplayer && (
											<Roleplayer
												socket={socket}
												cvr={currentUserVideoRef}
												peer={rpPeerInstance}
											/>
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
													Wating for student
												</h3>
											)}
										</div>
									</div>

									<div>
										<Typography
											variant="h4"
											style={{
												opacity: onGoing ? "1" : 0,
											}}
										>
											Currently Joined Student :{" "}
											<b>{std?.name}</b>
										</Typography>
									</div>
								</div>
							</div>
						)}
					</div>
				) : (
					<div>
						<div>
							<MoodIcon
								style={{ fontSize: "200px" }}
								mt="50px"
								color="success"
							/>
							<Typography variant="h2" mb="20px">
								All the candidates have given the exam
							</Typography>
							<a href="/" style={{ textDecoration: "none" }}>
								<Button variant="contained" size="large">
									Back to dashboard
								</Button>
							</a>
						</div>
					</div>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
