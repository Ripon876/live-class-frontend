import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { useSelector } from "react-redux";

function Candidate({ og, socket, clsId, msr, setStd, sP, sCT, sOg }) {
	const candidateVideoRef = useRef(null);
	const cdPeerRef = useRef(null);
	const iceConfig = useSelector((state) => state.iceConfig);

	useEffect(() => {
		console.log("component loaded");
		const peer = new Peer({
			config: iceConfig,
		});
		cdPeerRef.current = peer;

		socket.on("joinCandidate", (stdId) => {
			call(clsId + "candidate-roleplayer");

			socket.emit("getStudent", stdId, (std) => {
				setStd(std);
			});
			console.log(stdId);
			console.log("new student joining with roleplayer");
		});
	}, []);

	const call = (cdPI) => {
		console.log("calling");
		console.log(cdPI);

		const call = cdPeerRef.current.call(cdPI, msr.current);

		call?.on("stream", (rpStream) => {
			sP(0);
			sCT(Date.now());
			sOg(true);
			console.log("connected with candidte");
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
