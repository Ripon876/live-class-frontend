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
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCookies } from "react-cookie";
import axios from "axios";

function TodaysClassesOfRoleplayer() {
	const [cookies, setCookie] = useCookies([]);
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
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Today's Exams that you have to join 
				</Typography>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">Subject</TableCell>
								<TableCell align="right">
									Class Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{classes?.map((singleClass) => (
								<TableRow
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
										{singleClass.subject}
									</TableCell>
									<TableCell align="right">
										{singleClass.classDuration}
									</TableCell>
									<TableCell align="right">
										{singleClass.startTime}
									</TableCell>
									<TableCell align="right">
										<Button
											variant="filled"
											startIcon={<PlayArrowIcon />}
											onClick={() => {
												window.location.href = `/live-class?id=${singleClass._id}`;
											}}
										>
											Start
										</Button>
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

export default TodaysClassesOfRoleplayer;
