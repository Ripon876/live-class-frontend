import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function Candidate({ og, socket, clsId, msr, setStd, sCT, sOg, cvr, setA ,ce}) {
	const cdPeerRef = useRef(null);
	const iceConfig = useSelector((state) => state.iceConfig);
	const [searchParams, setSearchParams] = useSearchParams();
	const params = new URLSearchParams(window.location.search);

	useEffect(() => {
		// console.log("component loaded");
		const peer = new Peer({
			config: iceConfig,
		});
		cdPeerRef.current = peer;

		socket.on("joinCandidate", (stdId) => {
			call(clsId + "candidate-roleplayer");
			console.log("join with Candidate", stdId);

			if (stdId.timeleft) {
				searchParams.set("tl", stdId.timeleft);
				setSearchParams(searchParams);
				if (!ce) {
					setA({
						msg: "Candidate Reconnected",
						type: "success",
						open: true,
					});
				}
			}

			socket.emit("getStudent", stdId._id, (std) => {
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
