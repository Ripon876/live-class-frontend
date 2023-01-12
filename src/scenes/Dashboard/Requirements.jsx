import { useState, useEffect, useRef } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import WifiIcon from "@mui/icons-material/Wifi";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { green, pink } from "@mui/material/colors";

function Requirements() {
	const [requirements, setR] = useState({
		mic: false,
		camera: false,
		connection: false,
		speed: false,
	});

	const streamRef = useRef(null);

	useEffect(async () => {
		await navigator.mediaDevices
			.getUserMedia({
				audio: true,
				video: true,
			})
			.then((strean) => {
				if (strean) {
					setTimeout(() => {
						console.log("closing");
						setR({
							camera: true,
							mic: false,
							connection: false,
							speed: false,
						});
						strean?.getTracks()?.forEach((x) => x.stop());
					}, 1000);
				}
			})
			.then(() => {
				setTimeout(() => {
					setR({
						connection: false,
						speed: false,
						mic: true,
						camera: true,
					});
				}, 2000);
			})
			.then(() => {
				if (navigator.onLine) {
					setTimeout(() => {
						setR({
							speed: false,
							mic: true,
							camera: true,
							connection: true,
						});
					}, 4000);
				}
			})
			.then(() => {
				setTimeout(() => {
					setR({
						mic: true,
						camera: true,
						connection: true,
						speed: true,
					});
				}, 6000);
			});
	}, []);

	useEffect(() => {
		console.log("requirements updated");
		console.log(requirements);
	}, [requirements]);
	return (
		<div className="mt-5">
			<div>
				<Stack
					direction="row"
					spacing={2}
					sx={{ justifyContent: "center" }}
				>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[requirements.camera ? 500 : 1],
						}}
					>
						<VideocamIcon
							sx={{
								fontSize: "50px",
								opacity: requirements.camera ? 1 : 0.3,
							}}
						/>
						{!requirements.camera && (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[requirements.mic ? 500 : 1],
						}}
					>
						<MicIcon
							sx={{
								fontSize: "50px",
								opacity: requirements.mic ? 1 : 0.3,
							}}
						/>
						{!requirements.mic && (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[requirements.connection ? 500 : 1],
						}}
					>
						<WifiIcon
							sx={{
								fontSize: "50px",
								opacity: requirements.connection ? 1 : 0.3,
							}}
						/>
						{!requirements.connection && (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[requirements.speed ? 500 : 1],
						}}
					>
						<NetworkCheckIcon
							sx={{
								fontSize: "50px",
								opacity: requirements.speed ? 1 : 0.3,
							}}
						/>
						{!requirements.speed && (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
				</Stack>
			</div>
		</div>
	);
}

export default Requirements;
