import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import Countdown from "react-countdown";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import MoodIcon from "@mui/icons-material/Mood";

import Candidate from "./Candidate";

import "./style.css";

let socket;

function JoinExam() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const rolplayerId = useSelector((state) => state.id);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	// for call
	const [calling, setCaling] = useState(false);
	const [peerId, setPeerId] = useState(searchParams.get("id"));
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const [onGoing, setOngoing] = useState(false);
	const remoteVideoRef = useRef(null);
	const exmrVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const callerRef = useRef(null);
	const [std, setStd] = useState({});
	const myStream = useRef(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: rolplayerId });

			socket.emit("getClass", searchParams.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
					console.log(cls);
					setRemainingTime(cls.classDuration);
				} else {
					window.location.href = "/";
				}
			});
		});

		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			myStream.current = mediaStream;
			currentUserVideoRef.current.srcObject = mediaStream;
			currentUserVideoRef.current.play();
		});

		socket.on("allClassEnd", (text) => {
			// console.log("classes end : ", text);
			setClsEnd(true);
			peerInstance.current.destroy();
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
		const peer = new Peer(searchParams.get("id") + "roleplayer");
		const ad_peer = new Peer(searchParams.get("id") + "admin-roleplayer");

		ad_peer.on("call", (call) => {
			console.log("admin calling");

			call.answer(myStream.current);

			call.on("stream", function (remoteStream) {
				console.log("connected with admin");
			});
		});

		peer.on("open", (id) => {
			console.log(id);
			setPeerId(id);
		});

		peer.on("call", (call) => {
			console.log("examiner calling");
			setClsStarted(true);
			call.answer(myStream.current);

			call.on("stream", function (exmrStream) {
				exmrVideoRef.current.srcObject = exmrStream;
				exmrVideoRef.current.play();
			});
		});

		peerInstance.current = peer;
	}, []);

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
								<CircularProgress
									size="100px"
									mt="50px"
									color="success"
								/>
								<Typography variant="h3" mt="150px">
									' {cls.title} '
								</Typography>
								<Typography variant="h4" mb="20px">
									Each class will be : {cls.classDuration} min
								</Typography>
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
												Remainig Time :{" "}
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
													/>{" "}
												</b>
												min
											</Typography>
										)}
										<div className="video examinerVideo">
											<div>
												<video
													playsInline
													ref={exmrVideoRef}
													autoPlay
												/>

												<h2>Examiner</h2>
											</div>
										</div>
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
										<Candidate
											og={onGoing}
											socket={socket}
											clsId={searchParams.get("id")}
											msr={myStream}
										/>
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
export default JoinExam;
