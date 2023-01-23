import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Roleplayer from "./Roleplayer";
import ExamDetail from "./start-exam/ExamDetail";
import EndScreen from "./start-exam/EndScreen";
import MyVideo from "./start-exam/MyVideo";
import CandidateVideo from "./start-exam/CandidateVideo";
import ProgressBar from "./start-exam/ProgressBar";
import RemainingTime from "./start-exam/RemainingTime";
import CandidateInfo from "./start-exam/CandidateInfo";
import Mark from "./start-exam/Mark";
import BreakTimer from "./start-exam/BreakTimer";
import "./style.css";

let socket;

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [showBreak, setShowBreak] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const teacherId = useSelector((state) => state.user.id);
	const iceConfig = useSelector((state) => state.iceConfig);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const [mark, setMark] = useState(true);
	const [mSubmited, setMSubmited] = useState(false);
	const [alert, setAlert] = useState({
		msg: "",
		type: "success",
		open: false,
	});

	const [onGoing, setOngoing] = useState(false);
	const candidateVideoRef = useRef(null);
	const examinerVideoRef = useRef(null);
	const myStream = useRef(null);
	const peerInstance = useRef(null);
	const rpPeerInstance = useRef(null);
	const adPeerInstance = useRef(null);
	const [std, setStd] = useState({});
	const [aPId, setAPid] = useState("");
	const [progress, setProgress] = useState(0);
	const [progressTime, setProgressTime] = useState(0);
	const [taken, setTaken] = useState(0);
	const params = new URLSearchParams(window.location.search);

	useEffect(() => {
		setClsStarted(true);
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			// console.log("media loaded");
			myStream.current = mediaStream;
			examinerVideoRef.current.srcObject = mediaStream;
			examinerVideoRef.current.play();
		});

		return () => {
			socket.disconnect();
			myStream.current.getTracks()?.forEach((x) => x.stop());
		};
	}, []);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: teacherId });

			socket.emit("getClass", searchParams.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
					// console.log(cls);
					breaker(cls.classDuration);
					setProgressTime(((cls.classDuration * 60) / 100) * 1000);
					setRemainingTime(cls.classDuration);
				} else {
					window.location.href = "/";
				}
			});
		});

		socket.on("examEnd", () => {
			// console.log("classes end : ", text);
			// console.log("station end");
			setOngoing(false);
		});
		socket.on("delayStart", () => {
			if (params.get("tl")) {
				searchParams.delete("tl");
				setSearchParams(searchParams);
			}

			myStream.current.getAudioTracks()[0].enabled = false;
			// console.log("delay Started");
			setOngoing(false);
		});
		socket.on("delayEnd", () => {
			myStream.current.getAudioTracks()[0].enabled = true;
			// console.log("delay Ended");
			// setOngoing(true);
		});

		socket.on("breakStart", () => {
			myStream.current.getAudioTracks()[0].enabled = false;
			// console.log("break Started");
		});
		socket.on("breakEnd", () => {
			myStream.current.getAudioTracks()[0].enabled = true;
			// console.log("break End");
		});
		socket.on("examsStarted", () => {
			// console.log("exams Started");
		});
		socket.on("examsEnded", () => {
			// console.log("exams Ended");
			setClsEnd(true);
			peerInstance.current.destroy();
			myStream.current.getTracks()?.forEach((x) => x.stop());
		});
		socket.on("stdDisconnected", (id) => {
			// console.log("std disconnected ", id);
			setOngoing(false);
			if (!clsEnd) {
				setAlert({
					msg: "Candidate disconnected",
					type: "error",
					open: true,
				});
			}
		});

		socket.on("addWithAdmin", (id) => {
			setAPid(id);
			// console.log("admin want to join , : ", id);
		});
	}, []);

	const breaker = (t) => {
		// console.log(t);
		socket.once("breakTime", () => {
			setShowBreak((old) => true);
			myStream.current.getAudioTracks()[0].enabled = false;
			console.log("break time");
			setTimeout(() => {
				myStream.current.getAudioTracks()[0].enabled = true;
				setShowBreak(false);
			}, t * 60 * 1000);
		});
	};

	useEffect(() => {
		const peer = new Peer(searchParams.get("id"), {
			config: iceConfig,
		});
		const peer_rejoin = new Peer(searchParams.get("id") + "rejoin", {
			config: iceConfig,
		});
		const rp_peer = new Peer(searchParams.get("id") + "examiner", {
			config: iceConfig,
		});
		const ad_peer = new Peer(searchParams.get("id") + "admin-examiner", {
			config: iceConfig,
		});

		ad_peer.on("call", (call) => {
			// console.log("admin calling");
			call.answer(myStream.current);
			call.on("stream", function (remoteStream) {
				// console.log("connected with admin");
			});
		});

		peerInstance.current = peer;
		rpPeerInstance.current = rp_peer;
		adPeerInstance.current = ad_peer;
	}, []);

	useEffect(() => {
		peerInstance.current.on("call", (call) => {
			// console.log("candidate calling");

			call.answer(myStream.current);

			call.on("stream", function (remoteStream) {
				setOngoing(true);
				setProgress(0);
				setCurrentgTime(Date.now());

				setMark(true);
				setMSubmited(false);

				// console.log("data : ", call.metadata);
				candidateVideoRef.current.srcObject = remoteStream;
				candidateVideoRef.current.play();
				// get joined student info

				if (call.metadata.timeleft) {
					searchParams.set("tl", call.metadata.timeleft);
					setSearchParams(searchParams);
					if (!clsEnd) {
						setAlert({
							msg: "Candidate Reconnected",
							type: "success",
							open: true,
						});
					}
				}
				socket.emit(
					"addWithRoleplayer",
					{
						_id: call.metadata.std.id,
						timeleft: call.metadata.timeleft,
					},
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
	}, []);

	const startClass = () => {};

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={() => {
					setAlert({
						msg: "",
						type: "",
						open: false,
					});
				}}
			>
				<Alert severity={alert.type} sx={{ width: "100%" }}>
					{alert.msg}
				</Alert>
			</Snackbar>
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
							<ExamDetail exam={cls} se={startClass} />
						)}

						{clsStarted && (
							<div>
								{showBreak && (
									<h3 style={{ marginTop: "300px" }}>
										Exam will continue after{" "}
										<BreakTimer
											ct={Date.now()}
											rt={cls?.classDuration}
										/>
									</h3>
								)}
								<div
									className="container"
									style={{
										display: !showBreak ? "block" : "none",
									}}
								>
									<div className="video-container">
										{remainingTIme !== 0 && (
											<RemainingTime
												og={onGoing}
												setOg={setOngoing}
												ct={currentTime}
												rt={
													params.get("tl")
														? params.get("tl")
														: remainingTIme
												}
											/>
										)}
										{cls.roleplayer && (
											<Roleplayer
												setA={setAlert}
												ce={clsEnd}
												socket={socket}
												peer={rpPeerInstance}
												rpId={
													searchParams.get("id") +
													"roleplayer"
												}
												msr={myStream}
											/>
										)}
										<MyVideo
											mvr={examinerVideoRef}
											msr={myStream}
										/>
										<CandidateVideo
											cvr={candidateVideoRef}
											og={onGoing}
										/>
									</div>

									<CandidateInfo og={onGoing} c={std} />

									{mSubmited && (
										<h3 className="text-success">
											Mark Submited
										</h3>
									)}

									{mark && onGoing && (
										<Mark
											list={cls?.checklist}
											sm={setMark}
											ms={setMSubmited}
											cId={std._id}
											eId={cls._id}
										/>
									)}
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
