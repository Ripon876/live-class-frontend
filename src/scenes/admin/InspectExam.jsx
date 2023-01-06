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
	const [examsEnd, setExamsEnd] = useState(false);
	const exVideoRef = useRef(null);
	const rpVideoRef = useRef(null);
	const cdVideoRef = useRef(null);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);
		const ex_peer = new Peer();
		const rp_peer = new Peer();
		const cd_peer = new Peer();

		socket.on("allClsTaken", () => {
			setExamsEnd(true);
		});
		socket.on("cdChanging", () => {
			console.log("candidate changed");
			setTimeout(() => {
				call(
					cd_peer,
					searchParams.get("id") + "admin-candidate",
					cdVideoRef
				);
			}, 200);
		});
		const getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
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
		});
	}, []);

	const call = (peer, idToCall, vRef) => {
		console.log("calling", idToCall);
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: false }, (mediaStream) => {
			const call = peer.call(idToCall, mediaStream);
			call?.on("stream", (remoteStream) => {
				vRef.current.srcObject = mediaStream;
				vRef.current.play();
			});
		});
	};

	return (
		<div>
			<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
				<Box
					component="div"
					m="40px 40px "
					width="90%"
					p="0 0 0 20px"
					align="center"
				>
					<div>
						<div className="container">
							{!examsEnd && (
								<div className="align-items-center justify-content-center row video-container">
									<NewPeerVideo
										vRef={exVideoRef}
										title={"Examiner"}
									/>
									<NewPeerVideo
										vRef={rpVideoRef}
										title={"Roleplayer"}
									/>
									<NewPeerVideo
										vRef={cdVideoRef}
										title={"Candidate"}
									/>
								</div>
							)}
							{examsEnd && <h4>Exam Ended</h4>}
						</div>
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

const NewPeerVideo = ({ vRef, title }) => {
	return (
		<div className="video peerVideo col-6 p-0">
			<video playsInline autoPlay ref={vRef} className="h-100 w-100" />
			<h2>{title}</h2>
		</div>
	);
};
