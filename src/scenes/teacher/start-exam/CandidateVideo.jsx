import React from "react";

function CandidateVideo({ cvr, og }) {
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
			{!og && <h3 className="watingText">Wating for Candidate</h3>}
		</div>
	);
}

export default CandidateVideo;
