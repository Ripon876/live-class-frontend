import React from "react";

function CandidateVideo({cvr,og}) {
	return (
		<div className="video otherVideo">
			<video playsInline ref={cvr} autoPlay />
			{!og && <h3 className="watingText">Wating for student</h3>}
		</div>
	);
}

export default CandidateVideo;
