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
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCookies } from "react-cookie";
import axios from "axios";

function TodaysClassesOfStudent() {
	const [cookies, setCookie] = useCookies([]);
	const [classes, setClasses] = useState([]);
	const [firstClassId, setFCI] = useState("");

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/student/get-classes", {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => {
				setClasses([...data.data.classes]);
				setFCI(data.data.classes[data.data.firstClassIndex]._id);
			})
			.catch((err) => console.log("err :", err));
	}, []);

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Today's Class Schedule
				</Typography>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">Teacher</TableCell>
								<TableCell align="right">
									Class Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="center">Status</TableCell>
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
										{singleClass?.title}
									</TableCell>

									<TableCell align="right">
										{singleClass?.teacher?.name}
									</TableCell>
									<TableCell align="right">
										{singleClass?.classDuration}
									</TableCell>
									<TableCell align="right">
										{singleClass?.startTime}
									</TableCell>
									<TableCell align="center">
										{singleClass?.status}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				{/*	<Box
					component="div"
					mt="50px"
					sx={{ display: "flex", justifyContent: "center" }}
				>
					<Button
						disabled={classes.length === 0}
						size="large"
						variant="filled"
						sx={{
							boxShadow: 3,
							pt: "10px",
							pb: "10px",
						}}
						onClick={() => {
							window.location.href = `/live-class?id=${firstClassId}`;
						}}
					>
						<Typography variant="h3">
							<PlayArrowIcon /> Start Exams
						</Typography>
					</Button>
				</Box>*/}
			</Box>
		</div>
	);
}

export default TodaysClassesOfStudent;
