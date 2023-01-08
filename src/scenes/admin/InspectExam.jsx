import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSelector } from "react-redux";
let socket;

function InspectExam() {
	const [searchParams] = useSearchParams();
	const adminId = useSelector((state) => state.id);
	const [names, setNames] = useState({
		examiner: "",
		roleplayer: "",
		candidate: "",
		subject: "",
	});
	const [examsEnd, setExamsEnd] = useState(false);
	const [reload, setReload] = useState(false);
	const exVideoRef = useRef(null);
	const rpVideoRef = useRef(null);
	const cdVideoRef = useRef(null);
	const myStream = useRef(null);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		const getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			myStream.current = mediaStream;
		});

		const ex_peer = new Peer();
		const rp_peer = new Peer();
		const cd_peer = new Peer();
		exmInfo();
		socket.on("allClsTaken", () => {
			setExamsEnd(true);
			setReload(false);
		});
		socket.on("cdChanging", () => {
			setReload(true);
		});

		ex_peer.on("open", (id) => {
			console.log(id);
			call(
				ex_peer,
				searchParams.get("id") + "admin-examiner",
				exVideoRef
			);
		});
		rp_peer.on("open", (id) => {
			console.log(id);
			call(
				cd_peer,
				searchParams.get("id") + "admin-roleplayer",
				rpVideoRef
			);
		});
		cd_peer.on("open", (id) => {
			console.log(id);
			call(
				cd_peer,
				searchParams.get("id") + "admin-candidate",
				cdVideoRef
			);
		});
	}, []);

	const call = (peer, idToCall, vRef) => {
		console.log("calling", idToCall);

		const call = peer.call(idToCall, myStream.current);
		call?.on("stream", (remoteStream) => {
			vRef.current.srcObject = remoteStream;
			vRef.current.play();
		});
	};
	const exmInfo = () => {
		socket.emit("getExamInfo", searchParams.get("id"), (exam) => {
			console.log(exam);
			setNames({
				examiner: exam?.cls?.teacher,
				roleplayer: exam?.cls?.roleplayer,
				candidate: exam?.student?.name,
				subject: exam?.cls?.subject,
			});
		});
	};

	return (
		<div>
			<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
				<Box component="div" width="90%" p="0 0 0 20px" align="center">
					<div>
						<div className="container">
							{!examsEnd && !reload && (
								<div className="align-items-center justify-content-center row video-container">
									<NewPeerVideo
										vRef={exVideoRef}
										title={"Examiner"}
										name={names.examiner}
									/>
									<NewPeerVideo
										vRef={rpVideoRef}
										title={"Roleplayer"}
										name={names.roleplayer}
									/>
									<NewPeerVideo
										vRef={cdVideoRef}
										title={"Candidate"}
										name={names.candidate}
									/>
								</div>
							)}
							{!examsEnd && names.subject && (
								<>
									subject: <h3>{names.subject}</h3>
								</>
							)}
							{examsEnd && <h4>Exam Ended</h4>}
						</div>
						{reload && (
							<div>
								<Button
									variant="filled"
									sx={{
										mt: 1,
										ml: 2,
										boxShadow: 3,
									}}
									onClick={() => {
										window.location.reload();
									}}
									title="Session ended. please reload"
								>
									Reload
								</Button>
							</div>
						)}
						<div>
							<Button
								variant="filled"
								sx={{
									mt: 1,
									ml: 2,
									boxShadow: 3,
								}}
								onClick={() => {
									window.location.href = `/host_exam`;
								}}
							>
								Back to states
							</Button>
						</div>
					</div>
				</Box>
			</div>
		</div>
	);
}

export default InspectExam;

const NewPeerVideo = ({ vRef, title, name }) => {
	return (
		<div className="video peerVideo col-6 p-0">
			<video playsInline autoPlay ref={vRef} className="h-100 w-100" />
			<h2>
				{name}
				<span style={{ fontSize: "15px", marginLeft: "10px" }}>
					({title})
				</span>
			</h2>
		</div>
	);
};
