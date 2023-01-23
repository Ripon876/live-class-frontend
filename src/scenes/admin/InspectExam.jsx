import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Peer } from "peerjs";
import io from "socket.io-client";
import { useSelector } from "react-redux";
let socket;

function InspectExam() {
	const [searchParams] = useSearchParams();
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
	const adRef = useRef(null);
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

	useEffect(() => {
		// setNames({
		// 			examiner: exam?.cls?.teacher,
		// 			roleplayer: exam?.cls?.roleplayer,
		// 			candidate: exam?.student?.name,
		// 			title: exam?.cls?.title,
		// 		});

	}, []);

	return (
		<div>
			<div style={{ overflowY: "auto", maxHeight: "90%" }}>
				<Box component="div" width="90%" p="0 0 0 20px" align="center">
					<div>
						<div className="container">
							{!examsEnd && !reload && (
								<div className="align-items-center justify-content-center row video-container">
									<div className="video peerVideo col-6 p-0">
										<div
											className="h-100 w-100"
											id="examiner-video"
											ref={exRef}
										></div>

										<h2>
											{names?.examiner}
											<span
												style={{
													fontSize: "15px",
													marginLeft: "10px",
												}}
											>
												(examiner)
											</span>
										</h2>
									</div>
									<div className="video peerVideo col-6 p-0">
										<div
											className="h-100 w-100"
											id="examiner-video"
											ref={rpRef}
										></div>
										<h2>
											{names?.roleplayer}
											<span
												style={{
													fontSize: "15px",
													marginLeft: "10px",
												}}
											>
												(roleplayer)
											</span>
										</h2>
									</div>
									<div className="video peerVideo col-6 p-0">
										<div
											className="h-100 w-100"
											id="examiner-video"
											ref={cdRef}
										></div>
										<h2>
											{names?.candidate}
											<span
												style={{
													fontSize: "15px",
													marginLeft: "10px",
												}}
											>
												(candidate)
											</span>
										</h2>
									</div>
								</div>
							)}
							{examsEnd && <h4>Exam Ended</h4>}
						</div>
						{/*	{reload && (
							<div>
							
								<Button
									variant="filled"
									sx={{
										mt: 1,
										ml: 2,
										boxShadow: 3,
									}}
									onClick={() => {
										window.location.reload();
									}}
									title="Session ended. please reload"
								>
									Reload
								</Button>
							</div>
						)}*/}
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
