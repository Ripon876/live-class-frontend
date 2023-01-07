import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function Candidate({ og, socket }) {
	const candidateVideoRef = useRef(null);
	const cdPeerRef = useRef(null);

	useEffect(() => {
		const peer = new Peer();
		cdPeerRef.current = peer;

		socket.on("joinCandidate", (stdId) => {
			call(stdId._id + "candidate");
			console.log(stdId);
			console.log("new student joining with roleplayer");
		});
	}, []);

	const call = (cdPI) => {
		console.log("calling");
		console.log(cdPI);
		var getUserMedia =
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;

		getUserMedia({ video: true, audio: true }, (mediaStream) => {
			const call = cdPeerRef.current.call(cdPI, mediaStream);

			call?.on("stream", (rpStream) => {
				console.log("call accepted");
				candidateVideoRef.current.srcObject = rpStream;
				candidateVideoRef.current.play();
			});
		});
	};

	return (
		<div className="video otherVideo">
			<video playsInline ref={candidateVideoRef} autoPlay />
			{/*{!og && <h3 className="watingText">Wating for student</h3>}*/}
		</div>
	);
}

export default Candidate;
