import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import MeetingComp from "../MeetingComp";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
let socket;

function InspectExam() {
	const adminId = useSelector((state) => state.user.id);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [alert, setAlert] = useState({
		show: false,
		type: "success",
		msg: "",
	});

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("examsEnded", () => {
			setAlert({
				show: true,
				type: "success",
				msg: "All exams ended. Taking you back to states",
			});
			setTimeout(() => {
				window.close();
			}, 3000);
		});

		socket.on("delayStart", () => {
			setAlert({
				show: true,
				type: "success",
				msg: "Delay started. Taking you back to states",
			});
			setTimeout(() => {
				window.close();
			}, 3000);
		});
		socket.on("breakStart", () => {
			setAlert({
				show: true,
				type: "success",
				msg: "Break started. Taking you back to states",
			});
			setTimeout(() => {
				window.close();
			}, 3000);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div
			style={{
				height: "90%",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			<Snackbar
				open={alert.show}
				autoHideDuration={6000}
				onClose={() => {
					setAlert({
						msg: "",
						type: "success",
						show: false,
					});
				}}
			>
				<Alert severity={alert.type} sx={{ mb: 2 }}>
					{alert.msg}
				</Alert>
			</Snackbar>
			<Box sx={{ flexGrow: 1 }} className="px-3 pt-5" align="center">
				<div>
					<Grid
						container
						spacing={3}
						className="justify-content-center"
					>
						<Grid item sm={10} md={10}>
							<Typography
								variant="h4"
								align="right"
								pr="10px"
								mb="5px"
							></Typography>
							<MeetingComp
								id={params.get("id")}
								key="dsf34dsewr4ew"
								title={""}
								name={"Admin"}
							/>
						</Grid>
					</Grid>

					<div>
						<Button
							variant="filled"
							sx={{
								mt: 1,
								ml: 2,
								boxShadow: 3,
							}}
							onClick={() => {
								window.location.href = `/host_exam`;
							}}
						>
							Back to states
						</Button>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default InspectExam;
