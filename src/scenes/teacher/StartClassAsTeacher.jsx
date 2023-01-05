import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Roleplayer from "./Roleplayer";
import "./style.css";

import ExamDetail from "./start-exam/ExamDetail";
import EndScreen from "./start-exam/EndScreen";
import MyVideo from "./start-exam/MyVideo";
import CandidateVideo from "./start-exam/CandidateVideo";
import ProgressBar from "./start-exam/ProgressBar";
import RemainingTime from "./start-exam/RemainingTime";
import CandidateInfo from "./start-exam/CandidateInfo";
import Mark from "./start-exam/Mark";

let socket;

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [searchParams] = useSearchParams();
	const [cookies] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const teacherId = useSelector((state) => state.id);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const [mark, setMark] = useState(true);
	const [mSubmited, setMSubmited] = useState(false);
	// for call

	const [onGoing, setOngoing] = useState(false);
	const candidateVideoRef = useRef(null);
	const examinerVideoRef = useRef(null);
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
				console.log(data.data.cls);
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
			console.log("classes end : ", text);
			setClsEnd(true);
		});
	}, []);

	useEffect(() => {
		const peer = new Peer(searchParams.get("id"));
		const rp_peer = new Peer(searchParams.get("id") + "examiner");

		// console.log(peer);
		peer.on("call", (call) => {
			console.log("calling");

			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				examinerVideoRef.current.srcObject = mediaStream;
				examinerVideoRef.current.play();
				callerRef.current = call;
				setOngoing(true);
				setProgress(0);
				setCurrentgTime(Date.now());
				call.answer(mediaStream);

				call.on("stream", function (remoteStream) {
					// console.log("data : ", call.metadata);
					candidateVideoRef.current.srcObject = remoteStream;
					candidateVideoRef.current.play();
					// get joined student info
					setMark(true);
					setMSubmited(false);
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
							<ExamDetail exam={cls} se={startClass} />
						)}

						{clsStarted && (
							<div>
								<div className="container">
									<div className="video-container">
										{remainingTIme !== 0 && (
											<RemainingTime
												og={onGoing}
												ct={currentTime}
												rt={remainingTIme}
											/>
										)}
										{cls.roleplayer && (
											<Roleplayer
												socket={socket}
												cvr={examinerVideoRef}
												peer={rpPeerInstance}
											/>
										)}
										<MyVideo mvr={examinerVideoRef} />
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
