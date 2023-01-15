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

import Preloader from "./Preloader";
import Timer from "./Timer";
import VideoContainer from "./VideoContainer";
import PDFViewer from "./PDFViewer";

import "./style.css";

let socket;

function StartClassAsStudent() {
	const [cls, setCls] = useState({});
	const [clsTitle, setClsTitle] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const stdId = useSelector((state) => state.user.id);
	const iceConfig = useSelector((state) => state.iceConfig);
	const [onGoing, setOngoing] = useState(false);
	const [clsEnd, setClsEnd] = useState(false);
	const [loader, setLoader] = useState(true);
	const [remainingTIme, setRemainingTime] = useState(0);
	const [rTime, setRTime] = useState(0);
	const [currentTime, setCurrentgTime] = useState(Date.now());
	const stratClsBtn = useRef(null);
	const [user, setUser] = useState({});
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
		document.querySelector(".opendMenuIcon").click();
		setTimeout(() => {
			stratClsBtn.current.click();
			setClsStarted(true);
			setLoader(false);
			currentUserVideoRef.current.srcObject = myStream.current;
			currentUserVideoRef.current.play();
			// call();
		}, 5000);
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
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("setActive", { id: stdId });
			socket.emit("getClass", searchParams.get("id"), (cls, notfound) => {
				if (!notfound) {
					setCls(cls);
					// console.log(cls);
					setRemainingTime(cls.classDuration);
					setRTime(cls.classDuration)
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
			// console.log("media loaded");
			myStream.current = mediaStream;
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		const peer = new Peer({
			config: iceConfig,
		});
		const ad_peer = new Peer(searchParams.get("id") + "admin-candidate", {
			config: iceConfig,
		});

		peer.on("open", (id) => {
			setPeerId(id);
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

	useEffect(() => {
		if (cls?.classDuration) {
			setTimeout(
				() => {
					setClsStarted(false);
					setLoader(true);
					socket.emit(
						"clsEnd",
						{ stdId: stdId, clsId: clsId },
						(res) => {
							if (res.type === "joinNextClass") {
								// console.log("next class is their ,id : ", res.id);

								setTimeout(() => {
									setClsStarted(true);
									setLoader(false);
									call(res.id);
								}, 30000);

								setClsId(res.id);
								setSearchParams({ id: res.id });
								socket.emit("getClass", res.id, (cls) => {
									setClsTitle(cls?.title);
									setTimeout(() => {
										setCls(cls);
										setRemainingTime(cls.classDuration);
										setRTime(cls.classDuration)
									}, 30000);
								});
							}

							if (res.type === "allClassEnd") {
								setClsEnd(true);
								peerInstance.current.destroy();
								myStream.current
									.getTracks()
									?.forEach((x) => x.stop());
							}
						}
					);
				},
				searchParams.get("d")
					? searchParams.get("d") * 60 * 1000 + 5000
					: cls?.classDuration * 60 * 1000 + 5000
			);
		}
	}, [cls]);

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
		// console.log("calling examiner");
		call?.on("stream", (remoteStream) => {
			remoteVideoRef.current.srcObject = remoteStream;
			remoteVideoRef.current.play();
			setClsStarted(true);
			setOngoing(true);
			setProgress(0);
			setCurrentgTime(Date.now());
			setShowPdf(true);
			// console.log("connected with examiner");
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
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			{!clsEnd ? (
				<div>
					{!clsStarted && (
						<Preloader
							clsTitle={clsTitle}
							cls={cls}
							call={call}
							exId={searchParams.get("id")}
							rf={stratClsBtn}
						/>
					)}
					<div style={{ display: clsStarted ? "block" : "none" }}>
						{myStream.current && (
							<VideoContainer
								msr={myStream}
								evr={remoteVideoRef}
								og={onGoing}
								clsId={searchParams.get("id")}
								rp={cls.roleplayer}
								ct={currentTime}
								rt={remainingTIme}
								cls={cls}
								usr={user}
							/>
						)}
						<div className="px-5">
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
