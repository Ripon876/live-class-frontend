import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";

function Roleplayer({ cvr, clsId, msr, t, st }) {
	const rpVideoRef = useRef(null);
	const peerInstance = useRef(null);
	const rRef = useRef(null);

	useEffect(() => {
		const peer = new Peer(clsId + "candidate-roleplayer");

		peer.on("call", (call) => {
			console.log("receving call from roleplayer");
			call.answer(msr.current);
			call.on("stream", function (rpStream) {
				console.log("call accepted");
				rpVideoRef.current.srcObject = rpStream;
				rpVideoRef.current.play();
			});
		});
	}, []);

	const toggle = () => {
		if (rRef.current.classList.contains("rpVideo")) {
			st(!t);
		}
	};

	return (
		<div
			className={`video ${!t ? "rpVideo" : "otherVideo"}`}
			ref={rRef}
			onClick={toggle}
		>
			<div className="h-100">
				<video playsInline ref={rpVideoRef} autoPlay />
				{!t && <h2>Rp</h2>}
			</div>
		</div>
	);
}

export default Roleplayer;
