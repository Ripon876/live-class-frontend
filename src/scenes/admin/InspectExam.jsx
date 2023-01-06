import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSelector } from "react-redux";
let socket;

function InspectExam() {
	const [searchParams] = useSearchParams();
	const adminId = useSelector((state) => state.id);
	const exVideoRef = useRef(null);
	const rpVideoRef = useRef(null);
	const cdVideoRef = useRef(null);


	useEffect(() => {
		// socket = io.connect(process.env.REACT_APP_SERVER_URL);
		const ex_peer = new Peer();
		const rp_peer = new Peer();
		const cd_peer = new Peer();

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
							<div className="align-items-center justify-content-center row video-container">
								<NewPeerVideo vRef={exVideoRef} />
								<NewPeerVideo vRef={rpVideoRef} />
								<NewPeerVideo vRef={cdVideoRef} />
							</div>
						</div>
					</div>
				</Box>
			</div>
		</div>
	);
}

export default InspectExam;

const NewPeerVideo = ({ vRef }) => {
	return (
		<div className="video peerVideo col-6 p-0">
			<video playsInline autoPlay ref={vRef} className="h-100 w-100" />
		</div>
	);
};
