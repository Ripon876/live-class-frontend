import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import io from "socket.io-client";
import { useSelector } from "react-redux";
 
let socket;

function InspectExam() {
	const adminId = useSelector((state) => state.user.id);

	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);
	const [names, setNames] = useState({
		examiner: "",
		roleplayer: "",
		candidate: "",
		subject: "",
	});
	const [examsEnd, setExamsEnd] = useState(false);
	const [reload, setReload] = useState(false);

	const exRef = useRef(null);
	const cdRef = useRef(null);
	const rpRef = useRef(null);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("allClsTaken", () => {
			setExamsEnd(true);
			setReload(false);
		});
		socket.on("cdChanging", () => {
			setReload(true);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div>
			<div style={{ overflowY: "auto", maxHeight: "90%" }}>
				<Box component="div" width="90%" p="0 0 0 20px" align="center">
					<div>
						<div className="container">
							{!examsEnd && !reload && (
								<div className="align-items-center justify-content-center row video-container">
									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={exRef}
												></div>
											</div>
										</div>
										<CardContent className="p-2 ps-4">
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Examiner
											</Typography>
										</CardContent>
									</Card>

									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={rpRef}
												></div>
											</div>
										</div>
										<CardContent className="p-2 ps-4">
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Roleplayer
											</Typography>
										</CardContent>
									</Card>
									<Card
										className="m-2 p-0"
										style={{
											cursor: "pointer",
											maxWidth: "300px",
											maxHeight: "300px",
										}}
									>
										<div className="video cd-video">
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={cdRef}
												></div>
											</div>
										</div>
										<CardContent className="p-2 ps-4">
											<Typography
												variant="body2"
												color="text.secondary"
											>
												Candidate
											</Typography>
										</CardContent>
									</Card>
								</div>
							)}
							{examsEnd && <h4>Exam Ended</h4>}
						</div>

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
		</div>
	);
}

export default InspectExam;
