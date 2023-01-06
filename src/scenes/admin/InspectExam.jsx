import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSelector } from "react-redux";
let socket;

function InspectExam() {
	const [searchParams] = useSearchParams();
	const [streams, setStreams] = useState([]);
	const adminId = useSelector((state) => state.id);
	const [myStream, setMyStream] = useState(null);
	// searchParams.get("id"),

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.emit("joinWithAdmin", searchParams.get("id"));

		const getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			setMyStream(mediaStream);
		});

		const ex_peer = new Peer(adminId + "examiner");
		const rp_peer = new Peer(adminId + "roleplayer");
		const cd_peer = new Peer(adminId + "candidate");

		ex_peer.on("call", (call) => {
			console.log("calling");
			call.answer(myStream);
			call.on("stream", function (remoteStream) {
				setStreams([
					...streams,
					{ type: "Examiner", stream: remoteStream },
				]);
			});
		});

		rp_peer.on("call", (call) => {
			console.log("calling");
			call.answer(myStream);
			call.on("stream", function (remoteStream) {
				setStreams([
					...streams,
					{ type: "Roleplayer", stream: remoteStream },
				]);
			});
		});
		cd_peer.on("call", (call) => {
			console.log("calling");
			call.answer(myStream);
			call.on("stream", function (remoteStream) {
				setStreams([
					...streams,
					{ type: "Candidate", stream: remoteStream },
				]);
			});
		});
	}, []);

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
							<div className="align-items-center justify-content-center row video-container">
								{streams?.map((stream) => (
									<NewPeerVideo stream={stream} />
								))}
							</div>
						</div>
					</div>
				</Box>
			</div>
		</div>
	);
}

export default InspectExam;

const NewPeerVideo = ({ stream }) => {
	const vRef = useRef(null);

	useEffect(() => {
		console.log(stream?.type);
		vRef.current.srcObject = stream.stream;
		vRef.current.play();
	}, []);

	return (
		<div className="video peerVideo col-6 p-0">
			<video playsInline autoPlay ref={vRef} className="h-100 w-100" />
		</div>
	);
};
