import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function Roleplayer({ socket, cvr, peer }) {
	const rpVideoRef = useRef(null);
	const peerInstance = useRef(null);

	useEffect(() => {
		console.log(peer);
		socket.on("joinRolplayer", async (rpPId) => {
			call(rpPId);
		});
	}, []);

	const call = (rpPeerId) => {
		console.log("calling");
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			cvr.current.srcObject = mediaStream;
			cvr.current.play();

			const call = peer.current.call(rpPeerId, mediaStream);

			call?.on("stream", (rpStream) => {
				console.log("call accepted");
				rpVideoRef.current.srcObject = rpStream;
				rpVideoRef.current.play();
			});
		});
	};

	return (
		<div className="video rpVideo">
			<div>
				<video playsInline ref={rpVideoRef} autoPlay />
				<h2>Rp</h2>
			</div>
		</div>
	);
}

export default Roleplayer;
