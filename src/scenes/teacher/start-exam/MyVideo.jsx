import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

function MyVideo({ mvr, msr }) {
	const [mic, setMic] = useState(true);

	const handleMic = () => {
		if (mic) {
			msr.current.getAudioTracks()[0].enabled = false;
			setMic(false);
		} else {
			msr.current.getAudioTracks()[0].enabled = true;
			setMic(true);
		}
	};

	return (
		<div className="video myVideo" style={{ zIndex: 9999 }}>
			<div className="h-100">
				<video playsInline muted ref={mvr} autoPlay />

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
	);
}

export default MyVideo;
