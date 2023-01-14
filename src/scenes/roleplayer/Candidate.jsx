import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { useSelector } from "react-redux";

function Candidate({ og, socket, clsId, msr, setStd, sP, sCT, sOg, cvr }) {
	const cdPeerRef = useRef(null);
	const iceConfig = useSelector((state) => state.iceConfig);

	useEffect(() => {
		// console.log("component loaded");
		const peer = new Peer({
			config: iceConfig,
		});
		cdPeerRef.current = peer;

		socket.on("joinCandidate", (stdId) => {
			call(clsId + "candidate-roleplayer");

			socket.emit("getStudent", stdId, (std) => {
				setStd(std);
			});
			// console.log(stdId);
			// console.log("new student joining with roleplayer");
		});
	}, []);

	const call = (cdPI) => {
		// console.log("calling");
		// console.log(cdPI);

		const call = cdPeerRef.current.call(cdPI, msr.current);

		call?.on("stream", (rpStream) => {
			sP(0);
			sCT(Date.now());
			sOg(true);
			// console.log("connected with candidte");
			cvr.current.srcObject = rpStream;
			cvr.current.play();
		});
	};

	return (
		<div
			className="video otherVideo"
			style={{
				border: !og ? "5px solid #0e131e" : "none",
				borderRadius: !og ? "10px" : 0,
			}}
		>
			<video
				playsInline
				ref={cvr}
				autoPlay
				className={og ? "d-block" : "d-none"}
			/>
		</div>
	);
}

export default Candidate;
