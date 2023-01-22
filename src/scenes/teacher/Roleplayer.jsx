import React, { useEffect, useRef, useState } from "react";

function Roleplayer({ peer, rpId, msr, socket, setA, ce }) {
	const rpVideoRef = useRef(null);
	const peerInstance = useRef(null);

	useEffect(() => {
		socket.on("examIdEx", (id) => {
			call(id + "roleplayer");
		});

		socket.on("roDisconnected", (ro) => {
			console.log("Roleplayer disconnected ");
			if (!ce) {
				rpVideoRef.current.srcObject = null;
				setA({
					msg: "Roleplayer disconnected",
					type: "error",
					open: true,
				});
			}
		});

		socket.on("connectWithRp", () => {
			if (!ce) {
				call(rpId);
				setA({
					msg: "Roleplayer Rejoining",
					type: "success",
					open: true,
				});
			}
		});
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
