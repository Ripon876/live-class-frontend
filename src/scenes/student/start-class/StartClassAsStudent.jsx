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
import VideoContainer2 from "./VideoContainer2";
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
	const [loader, setLoader] = useState(true);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const stratClsBtn = useRef(null);

	const [peerId, setPeerId] = useState("");
	const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const rpPeerInstance = useRef(null);
	const myStream = useRef(null);
	const [clsId, setClsId] = useState(searchParams.get("id"));
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		document
			.querySelector(".css-1ljns5e-MuiButtonBase-root-MuiIconButton-root")
			.click();
		setTimeout(() => {
			stratClsBtn.current.click();
setClsStarted(true);
			setLoader(false);
			// call();
		}, 5000);
	}, []);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: stdId });
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
			console.log("media loaded");
			myStream.current = mediaStream;
			currentUserVideoRef.current.srcObject = myStream.current;
			currentUserVideoRef.current.play();
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
			call.answer(myStream.current);
			call.on("stream", function (remoteStream) {
				console.log("connected with admin");
			});
		});
		peerInstance.current = peer;

		return () => {
			console.log("component unmount");
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
					peerInstance.current.destroy();
				}
			});
		}
	}, [progress]);

	const call = (remotePeerId) => {
		let options = {
			metadata: {
				std: { id: stdId },
			},
		};
		const call = peerInstance.current.call(
			remotePeerId,
			myStream.current,
			options
		);
		console.log("calling examiner");
		call?.on("stream", (remoteStream) => {
			remoteVideoRef.current.srcObject = remoteStream;
			remoteVideoRef.current.play();
			setClsStarted(true);
			document
				.querySelector(
					".css-1ljns5e-MuiButtonBase-root-MuiIconButton-root"
				)
				.click();
			setOngoing(true);
			setProgress(0);
			setCurrentgTime(Date.now());
			setShowPdf(true);
			console.log("connected with examiner");
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

		{/*	<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
			>
				{!clsEnd ? (
					<div>
						{!clsStarted && (
							<Preloader
								cls={cls}
								call={call}
								exId={searchParams.get("id")}
								rf={stratClsBtn}
							/>
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
										clsId={searchParams.get("id")}
										rp={cls.roleplayer}
										msr={myStream}
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
			</Box>*/}

			{!clsEnd ? (
				<div>
					{!clsStarted && (
						<Preloader
							cls={cls}
							call={call}
							exId={searchParams.get("id")}
							rf={stratClsBtn}
						/>
					)}
					<div style={{ display: clsStarted ? "block" : "none" }}>
						{myStream.current  && (
							<VideoContainer2
								msr={myStream}
								evr={remoteVideoRef}
								og={onGoing}
								clsId={searchParams.get("id")}
								rp={cls.roleplayer}
								ct={currentTime}
								rt={remainingTIme}
								cls={cls}
							/>
						)}
						<div className='px-5'>
						{showPdf && cls?.pdf && (
							<PDFViewer
								pdf={cls?.pdf?.file}
								vf={cls?.pdf?.visibleFor}
								ssp={setShowPdf}
							/>
						)}	
						</div>
						
					</div>
				</div>
			) : (
				<div>
					<div className="text-center">
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
		</div>
	);
}

export default StartClassAsStudent;
