import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function Roleplayer({ socket, cvr, stdId }) {
	const rpVideoRef = useRef(null);
	const peerInstance = useRef(null);

	useEffect(() => {
		const peer = new Peer(stdId + "candidate");

		// socket.on("joinRolplayer", async (rpPId) => {
		// 	call(rpPId);
		// });
		peer.on("call", (call) => {
			console.log("receving call from roleplayer");

			var getUserMedia =
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;

			getUserMedia({ video: true, audio: true }, (mediaStream) => {
				// currentUserVideoRef.current.srcObject = mediaStream;
				// currentUserVideoRef.current.play();
				call.answer(mediaStream);
				call.on("stream", function (rpStream) {
					// remoteVideoRef.current.srcObject = remoteStream;
					// remoteVideoRef.current.play();
					console.log("call accepted");
					rpVideoRef.current.srcObject = rpStream;
					rpVideoRef.current.play();
				});
			});
		});
	}, []);

	// const call = (rpPeerId) => {
	// 	console.log("calling");
	// 	var getUserMedia =
	// 		navigator.getUserMedia ||
	// 		navigator.webkitGetUserMedia ||
	// 		navigator.mozGetUserMedia;

	// 	getUserMedia({ video: true, audio: true }, (mediaStream) => {
	// 		cvr.current.srcObject = mediaStream;
	// 		cvr.current.play();

	// 		const call = peer.current.call(rpPeerId, mediaStream);

	// 		call?.on("stream", (rpStream) => {
	// 			console.log("call accepted");
	// 			rpVideoRef.current.srcObject = rpStream;
	// 			rpVideoRef.current.play();
	// 		});
	// 	});
	// };

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
