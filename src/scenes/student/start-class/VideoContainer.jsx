import { useState, useEffect, useRef } from "react";
import Roleplayer from "../Roleplayer";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

function VideoContainer({ cvr, rvr, og, clsId, rp, msr }) {
	const [mic, setMic] = useState(true);
	const [toggled, setToggled] = useState(false);
	const oRef = useRef(null);

	const handleMic = () => {
		if (mic) {
			msr.current.getAudioTracks()[0].enabled = false;
			setMic(false);
		} else {
			msr.current.getAudioTracks()[0].enabled = true;
			setMic(true);
		}
	};

	const toggle = () => {
		if (oRef.current.classList.contains("rpVideo")) {
			setToggled(!toggled);
		}
	};

	return (
		<>
			{rp && (
				<Roleplayer
					cvr={cvr}
					st={setToggled}
					t={toggled}
					msr={msr}
					clsId={clsId}
				/>
			)}
			<div className="video myVideo" style={{ zIndex: 9999 }}>
				<div className="h-100">
					<video playsInline muted ref={cvr} autoPlay />
					<h2>You</h2>
					<div
						style={{
							position: "absolute",
							right: 0,
							bottom: "10px",
							display: "flex",
							alignItems: "end",
						}}
					>
						{mic ? (
							<MicIcon
								sx={{ cursor: "pointer" }}
								onClick={handleMic}
							/>
						) : (
							<MicOffIcon
								sx={{ cursor: "pointer" }}
								onClick={handleMic}
							/>
						)}
					</div>
				</div>
			</div>
			<div
				className={`video ${!toggled ? "otherVideo" : "rpVideo"}`}
				ref={oRef}
				onClick={toggle}
			>
				<video playsInline ref={rvr} autoPlay />
				{!og && <h3 className="watingText">Joining</h3>}
				{toggled && <h2>Examiner</h2>}
			</div>
		</>
	);
}

export default VideoContainer;
