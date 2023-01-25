import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import axios from "axios";

function TodaysClassesOfTeacher() {
	const [cookies] = useCookies([]);
	const [classes, setClasses] = useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/teacher/get-classes", {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => setClasses([...data.data.classes]))
			.catch((err) => console.log("err :", err));
	}, []);
	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Today's Exams Schedule
				</Typography>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">
									Exam Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="right">Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{classes?.map((singleClass, i) => (
								<TableRow
									key={"sdf433df" + i}
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}
								>
									<TableCell component="th" scope="row">
										{singleClass.title}
									</TableCell>
									<TableCell align="right">
										{singleClass.classDuration}
									</TableCell>
									<TableCell align="right">
										{new Date(singleClass?.startTime)
											.toLocaleTimeString()
											.slice(0, 4) +
											" " +
											new Date(singleClass?.startTime)
												.toLocaleTimeString()
												.slice(8)}
									</TableCell>
									<TableCell align="right">
										{singleClass.status === "Ongoing" && (
											<Button
												size="normal"
												variant="filled"
												sx={{
													boxShadow: 3,
													pt: "10px",
													pb: "10px",
												}}
												onClick={() => {
													window.location.href = `/live-class?id=${singleClass._id}&rejoin=true`;
												}}
											>
												<Typography variant="h3">
													Rejoin
												</Typography>
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</div>
	);
}

export default TodaysClassesOfTeacher;
