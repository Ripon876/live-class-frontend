import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MoodIcon from "@mui/icons-material/Mood";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Preloader from "./Preloader";
import VideoContainer from "./VideoContainer";
import PDFViewer from "./PDFViewer";

import "./style.css";

let socket;

function StartClassAsStudent() {
	const [cls, setCls] = useState({});
	const [clsTitle, setClsTitle] = useState("");
	const [showBreak, setShowBreak] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [clsStarted, setClsStarted] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const stdId = useSelector((state) => state.user.id);
	const iceConfig = useSelector((state) => state.iceConfig);
	const [onGoing, setOngoing] = useState(false);
	const [clsEnd, setClsEnd] = useState(false);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const stratClsBtn = useRef(null);
	const [user, setUser] = useState({});
	const remoteVideoRef = useRef(null);
	const currentUserVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const myStream = useRef(null);
	const [alert, setAlert] = useState({
		msg: "",
		type: "",
		open: false,
	});
	const [clsId, setClsId] = useState(searchParams.get("id"));
	const params = new URLSearchParams(window.location.search);

	useEffect(() => {
		document.querySelector(".opendMenuIcon").click();

		setTimeout(() => {
			// stratClsBtn.current.click();
			// setClsStarted(true);

			currentUserVideoRef.current.srcObject = myStream.current;
			currentUserVideoRef.current.play();
			// call();
		}, 2000);
	}, []);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/get-user-details", {
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			})
			.then((data) => {
				setUser(data.data.user);
			})
			.catch((err) => {
				console.log("err : ", err);
			});
	}, []);

	useEffect(() => {
		console.log("search param changes");
	}, [searchParams.get("id")]);

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
		socket.on("exDisconnected", (ex) => {
			console.log("Examiner disconnected ");
			if (!clsEnd) {
				remoteVideoRef.current.srcObject = null;
				setAlert({
					msg: "Examiner disconnected",
					type: "error",
					open: true,
				});
			}
		});
		socket.on("examsStarted", () => {
			console.log("exams Started");
		});
		socket.on("examIdCd", (id) => {
			// stratClsBtn.current.click();
			console.log("calling", id);

			setSearchParams({ id: id });
			setClsId(id);
			call(id);

			socket.emit("getClass", id, (cls) => {
				setClsTitle(cls?.title);
				console.log(cls);
				setCls(cls);
				setRemainingTime(cls.classDuration);
			});
		});
		socket.on("examEnd", () => {
			// console.log("classes end : ", text);
			console.log("station end");
			setClsStarted(false);
		});
		socket.on("delayStart", () => {
			myStream.current.getAudioTracks()[0].enabled = false;
			console.log("delay Started");
			setClsStarted(false);
		});
		socket.on("delayEnd", () => {
			console.log("delay Ended");

			myStream.current.getAudioTracks()[0].enabled = true;
			// setClsStarted(false);
		});

		socket.on("breakStart", () => {
			setShowBreak(true);
			myStream.current.getAudioTracks()[0].enabled = false;

			console.log("break Started");
		});

		socket.on("breakEnd", () => {
			console.log("break End");

			myStream.current.getAudioTracks()[0].enabled = true;
			setShowBreak(false);
			setClsStarted(true);
		});

		socket.on("examsEnded", () => {
			console.log("exams Ended");
			setClsEnd(true);
			peerInstance.current.destroy();
			myStream.current.getTracks()?.forEach((x) => x.stop());
		});

		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			// console.log("media loaded");
			myStream.current = mediaStream;
		});

		return () => {
			socket.disconnect();
			myStream.current.getTracks()?.forEach((x) => x.stop());
		};
	}, []);

	useEffect(() => {
		const peer = new Peer({
			config: iceConfig,
		});
		const ad_peer = new Peer(searchParams.get("id") + "admin-candidate", {
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
	}, []);

	const call = (remotePeerId) => {
		let options = {
			metadata: {
				std: { id: stdId },
				timeleft: params.get("tl") ? params.get("tl") : null,
			},
		};
		const call = peerInstance.current.call(
			remotePeerId,
			myStream.current,
			options
		);
		// console.log("calling examiner");
		call?.on("stream", (remoteStream) => {
			setClsStarted(true);
			remoteVideoRef.current.srcObject = remoteStream;
			remoteVideoRef.current.play();

			setOngoing(true);
			setCurrentgTime(Date.now());

			if (cls?.pdf) {
				setShowPdf(true);
			}
			// console.log("connected with examiner");
		});
	};

	const callClsEnd = () => {
		setClsStarted(false);

		socket.emit("clsEnd", { stdId: stdId, clsId: clsId }, (res) => {
			if (res.type === "joinNextClass") {
				if (res.break) {
				} else {
					setTimeout(() => {
						setClsStarted(true);
						call(res.id);
					}, 30000);
				}

				setClsId(res.id);
				setSearchParams({ id: res.id });
			}
		});
	};

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

			{!clsEnd ? (
				<div>
					{!clsStarted && (
						<Preloader
							clsTitle={clsTitle}
							cls={cls}
							call={call}
							exId={searchParams.get("id")}
							rf={stratClsBtn}
							bt={showBreak}
						/>
					)}
					<div style={{ display: clsStarted ? "block" : "none" }}>
						{myStream.current && (
							<div
								style={{ display: !showPdf ? "block" : "none" }}
							>
								<VideoContainer
									msr={myStream}
									evr={remoteVideoRef}
									og={onGoing}
									clsId={searchParams.get("id")}
									rp={cls.roleplayer}
									ct={currentTime}
									rt={
										params.get("tl")
											? params.get("tl")
											: remainingTIme
									}
									cls={cls}
									usr={user}
									socket={socket}
									setA={setAlert}
									ce={clsEnd}
								/>
							</div>
						)}
						<div className="px-5">
							{cls?.pdf && (
								<PDFViewer
									pdf={cls?.pdf?.file}
									vf={cls?.pdf?.visibleFor}
									ssp={setShowPdf}
									s={showPdf}
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
