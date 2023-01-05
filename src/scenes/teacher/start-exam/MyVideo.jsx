import React from "react";

function MyVideo({ mvr }) {
	return (
		<div className="video myVideo">
			<div>
				<video playsInline muted ref={mvr} autoPlay />

				<h2>You</h2>
			</div>
		</div>
	);
}

export default MyVideo;
