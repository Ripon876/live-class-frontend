import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MoodIcon from "@mui/icons-material/Mood";
import LinearProgress from "@mui/material/LinearProgress";

import Preloader from "./Preloader";
import Timer from "./Timer";
import VideoContainer from "./VideoContainer";
import PDFViewer from "./PDFViewer";

import "./style.css";

let socket;

function StartClassAsStudent() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const stdId = useSelector((state) => state.id);
	const [onGoing, setOngoing] = useState(false);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const stratClsBtn = useRef(null);

	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const rpPeerInstance = useRef(null);
	const [clsId, setClsId] = useState(searchParams.get("id"));
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		// console.log("stdId : ", stdId);

		socket.on("connect", () => {
			// console.log("socket connected");
			socket.emit("setActive", { id: stdId });
			socket.emit("getClass", searchParams.get("id"), (cls) => {
				setCls(cls);
				console.log(cls);
				setRemainingTime(cls.classDuration);
			});
		});

		socket.on("startClass", async () => {
			// console.log("starting cls");

			stratClsBtn.current.click();
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const peer = new Peer();
		const ad_peer = new Peer(searchParams.get("id") + "admin-candidate");

		peer.on("open", (id) => {
			setPeerId(id);
		});

		ad_peer.on("call", (call) => {
			console.log("admin calling");

			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				call.answer(mediaStream);

				call.on("stream", function (remoteStream) {
					console.log("connected with admin");
				});
			});
		});
		peerInstance.current = peer;

		return () => {
			// console.log("component unmount");
		};
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
		if (progress === 100 && onGoing) {
			socket.emit("clsEnd", { stdId: stdId, clsId: clsId }, (res) => {
				if (res.type === "joinNextClass") {
					// console.log("next class is their ,id : ", res.id);
					call(res.id);
					setClsId(res.id);
					setSearchParams({ id: res.id });
					socket.emit("getClass", res.id, (cls) => {
						setCls(cls);
						setRemainingTime(cls.classDuration);
					});
				}

				if (res.type === "allClassEnd") {
					// console.log("no more cls , msg: ", res.text);
					setClsEnd(true);
				}
			});
		}
	}, [progress]);

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

			// console.log("calling teacher");

			call.on("stream", (remoteStream) => {
				remoteVideoRef.current.srcObject = remoteStream;
				remoteVideoRef.current.play();
				setOngoing(true);
				setProgress(0);
				setCurrentgTime(Date.now());
				setClsStarted(true);
				setShowPdf(true);
				// console.log("call accepted");
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
							<Preloader cls={cls} call={call} rf={stratClsBtn} />
						)}

						<div style={{ display: clsStarted ? "block" : "none" }}>
							<div className="container">
								<div className="video-container">
									{remainingTIme !== 0 && (
										<Timer
											ct={currentTime}
											rt={remainingTIme}
										/>
									)}
									<VideoContainer
										cvr={currentUserVideoRef}
										rvr={remoteVideoRef}
										og={onGoing}
										socket={socket}
										stdId={stdId}
										rp={cls.roleplayer}
									/>
								</div>
								<div>
									<Typography variant="h4">
										Ongoing : <b>{cls?.title}</b>
									</Typography>
									<Typography variant="h4">
										Teacher : <b>{cls?.teacher?.name}</b>
									</Typography>
								</div>
							</div>
						</div>
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
								No More Exams Left Today
							</Typography>
							<a href="/" style={{ textDecoration: "none" }}>
								<Button variant="contained" size="large">
									Back to dashboard
								</Button>
							</a>
						</div>
					</div>
				)}

				{showPdf && cls?.pdf && (
					<PDFViewer
						pdf={cls?.pdf?.file}
						vf={cls?.pdf?.visibleFor}
						ssp={setShowPdf}
					/>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsStudent;
