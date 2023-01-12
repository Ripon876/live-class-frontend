import { useState, useEffect, useRef } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import WifiIcon from "@mui/icons-material/Wifi";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { green, pink } from "@mui/material/colors";

function Requirements({ rq, srq }) {
	const streamRef = useRef(null);

	useEffect(() => {
		const checkRequirements = async () => {
			await navigator.mediaDevices
				.getUserMedia({
					audio: true,
					video: true,
				})
				.then((strean) => {
					if (strean) {
						setTimeout(() => {
							srq({
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
						srq({
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
							srq({
								speed: false,
								mic: true,
								camera: true,
								connection: true,
							});
						}, 3000);
					}
				})
				.then(() => {
					setTimeout(() => {
						srq({
							mic: true,
							camera: true,
							connection: true,
							speed: true,
						});
					}, 4000);
				});
		};
		checkRequirements();
	}, []);

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
							bgcolor: green[rq.camera ? 500 : 1],
						}}
					>
						<VideocamIcon
							sx={{
								fontSize: "50px",
								opacity: rq.camera ? 1 : 0.3,
							}}
						/>
						{!rq.camera ? (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						) : (
							<CheckIcon
								color="info"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[rq.mic ? 500 : 1],
						}}
					>
						<MicIcon
							sx={{
								fontSize: "50px",
								opacity: rq.mic ? 1 : 0.3,
							}}
						/>
						{!rq.mic ? (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						) : (
							<CheckIcon
								color="info"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[rq.connection ? 500 : 1],
						}}
					>
						<WifiIcon
							sx={{
								fontSize: "50px",
								opacity: rq.connection ? 1 : 0.3,
							}}
						/>
						{!rq.connection ? (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						) : (
							<CheckIcon
								color="info"
								sx={{ position: "absolute" }}
							/>
						)}
					</Avatar>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							bgcolor: green[rq.speed ? 500 : 1],
						}}
					>
						<NetworkCheckIcon
							sx={{
								fontSize: "50px",
								opacity: rq.speed ? 1 : 0.3,
							}}
						/>
						{!rq.speed ? (
							<CircularProgress
								color="success"
								sx={{ position: "absolute" }}
							/>
						) : (
							<CheckIcon
								color="info"
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
