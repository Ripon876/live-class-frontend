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

import ExamDetail from "./start-exam/ExamDetail";
import EndScreen from "./start-exam/EndScreen";
import MyVideo from "./start-exam/MyVideo";
import CandidateVideo from "./start-exam/CandidateVideo";
import ProgressBar from "./start-exam/ProgressBar";

let socket;

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [haveRp, setHaveRp] = useState(false);
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
				// console.log(data.data.cls);
				// console.log()
				setHaveRp(Boolean(data.data.cls.roleplayer));
				setCls({ ...data.data.cls });
				setRemainingTime(data.data.cls.classDuration);
				// console.log("getting class using axios : ", data.data.cls);
			})
			.catch((err) => console.log("err :", err));
	}, []);

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

					socket.emit(
						"addWithRoleplayer",
						{ _id: call.metadata.std.id },
						searchParams.get("id")
					);

					socket.emit("getStudent", call.metadata.std.id, (std) => {
						setStd(std);
						// console.log(std);
						// check for roleplayer exists or not
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
			<ProgressBar
				og={onGoing}
				ee={clsEnd}
				exam={cls}
				pr={progress}
				setPr={setProgress}
			/>

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
								<ExamDetail exam={cls} se={startClass} />
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
										<MyVideo mvr={currentUserVideoRef} />
										<CandidateVideo
											cvr={remoteVideoRef}
											og={onGoing}
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
					<EndScreen />
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
