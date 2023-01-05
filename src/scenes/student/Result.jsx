import { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MoodIcon from "@mui/icons-material/Mood";
import Box from "@mui/material/Box";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function Result() {
	const [marks, setMarks] = useState([]);

	const [result, setResult] = useState(0);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/student/get-result", {
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			})
			.then((data) => {
				setMarks(data.data.marks);
				console.log(data.data.marks);
			})
			.catch((err) => console.log("err :", err));
	}, []);

	useEffect(() => {
		let totalMark =
			Number(
				marks.reduce((total, exam) => {
					return total + exam.mark;
				}, 0)
			) / Number(marks.length);

		setResult(Math.floor(totalMark));
	}, [marks]);

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<div>
					{marks.length !== 0 ? (
						<div>
							<Typography style={{ textAlign: "center" }}>
								<span
									style={{
										fontSize: "150px",
										textAlign: "center",
										position: "relative",
									}}
								>
									{result !== NaN && result}
									<VerifiedIcon
										sx={{
											position: "absolute",
											top: "45px",
											right: "-20px",
										}}
										color="success"
									/>
								</span>
								out of 20
							</Typography>
							<Typography variant="h3" mb="20px">
								You got {result !== NaN && result} out of 20
							</Typography>
						</div>
					) : (
						<div>
							<Typography style={{ textAlign: "center" }}>
								<span
									style={{
										fontSize: "40px",
										textAlign: "center",
										position: "relative",
									}}
								>
									Result Not Available Right Now
								</span>
							</Typography>
						</div>
					)}

					{marks.length !== 0 && (
						<TableContainer component={Paper}>
							<Table
								sx={{ minWidth: "90%" }}
								aria-label="simple table"
							>
								<TableHead>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell align="right">
											Subject
										</TableCell>
										<TableCell align="right">
											Mark
										</TableCell>
										<TableCell align="right">
											Comment
										</TableCell>
										<TableCell align="right">
											Assessments
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{marks?.map((exam, i) => (
										<TableRow
											sx={{
												"&:last-child td, &:last-child th":
													{
														border: 0,
													},
											}}
										>
											<TableCell>{i + 1}</TableCell>
											<TableCell align="right">
												{exam?.exam.subject}
											</TableCell>
											<TableCell align="right">
												{exam?.mark}
											</TableCell>
											<TableCell align="right">
												{exam?.comment}
											</TableCell>
											<TableCell align="right">
												{exam?.list?.map((item) => (
													<p className="mb-0">
														{item.passed ? (
															<CheckCircleIcon
																color="success"
																sx={{
																	fontSize:
																		"20px",
																}}
																className="me-2"
															/>
														) : (
															<CancelIcon
																color="error"
																sx={{
																	fontSize:
																		"20px",
																}}
																className="me-2"
															/>
														)}

														{item?.title}
													</p>
												))}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</div>
			</Box>
		</div>
	);
}

export default Result;
