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
import AddIcon from "@mui/icons-material/Add";

function TodaysClassesOfRoleplayer() {
	const [cookies, setCookie] = useCookies([]);
	const [classes, setExams] = useState([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/roleplayer/get-exams", {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => setExams([...data.data.exams]))
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
								<TableCell align="right">
									Exam Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="right">Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{classes?.map((singleClass, i) => (
								<TableRow
									key={"s4d43jhdf" + i}
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
										{singleClass.status}
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
