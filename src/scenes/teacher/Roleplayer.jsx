import React, { useEffect, useRef, useState } from "react";

function Roleplayer({ peer, rpId, msr }) {
	const rpVideoRef = useRef(null);
	const peerInstance = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			call(rpId);
		}, 3500);
	}, []);

	const call = (rpPeerId) => {
		// console.log("calling Roleplayer");
		const call = peer.current.call(rpPeerId, msr.current);

		call?.on("stream", (rpStream) => {
			// console.log("call accepted");
			rpVideoRef.current.srcObject = rpStream;
			rpVideoRef.current.play();
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
