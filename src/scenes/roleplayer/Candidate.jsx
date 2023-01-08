import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function Candidate({ og, socket, clsId, msr }) {
	const candidateVideoRef = useRef(null);
	const cdPeerRef = useRef(null);

	useEffect(() => {
		const peer = new Peer();
		cdPeerRef.current = peer;

		socket.on("joinCandidate", (stdId) => {
			call(clsId + "candidate-roleplayer");
			console.log(stdId);
			console.log("new student joining with roleplayer");
		});
		setTimeout(() => {
			call(clsId + "candidate-roleplayer");
		}, 3500);
	}, []);

	const call = (cdPI) => {
		console.log("calling");
		console.log(cdPI);

		const call = cdPeerRef.current.call(cdPI, msr.current);

		call?.on("stream", (rpStream) => {
			console.log("call accepted");
			candidateVideoRef.current.srcObject = rpStream;
			candidateVideoRef.current.play();
		});
	};

	return (
		<div className="video otherVideo">
			<video playsInline ref={candidateVideoRef} autoPlay />
		</div>
	);
}

export default Candidate;
