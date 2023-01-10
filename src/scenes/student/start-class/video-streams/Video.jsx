import { useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Video({ cd, ex, rp, title, stream }) {
	const vRef = useRef(null);

	useEffect(() => {
		if (stream) {
			vRef.current.srcObject = stream.current;
			vRef.current.play();
		}
	}, []);

	return (
		<Card className="mb-2" style={{ cursor: rp ? "pointer" : "normal" }}>
			<div
				className={`video cd-video ${rp ? "small-video" : ""}  ${
					ex ? "large-video" : ""
				}`}
			>
				<div className="h-100 w-100">
					<video
						playsInline
						muted
						autoPlay
						className="w-100 h-100 bg-black"
						ref={vRef}
					/>
				</div>
			</div>
			<CardContent className="p-2 ps-4">
				{cd && (
					<Typography
						gutterBottom
						variant="h3"
						component="div"
						className="m-0"
					>
						Lizard
					</Typography>
				)}
				<Typography variant="body2" color="text.secondary">
					{title}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default Video;
