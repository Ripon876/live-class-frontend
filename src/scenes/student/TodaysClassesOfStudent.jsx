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
import { useSelector } from "react-redux";
import axios from "axios";

function TodaysClassesOfStudent() {
	const [cookies, setCookie] = useCookies([]);
	const [classes, setClasses] = useState([]);
	const [studentsStates, setSS] = useState({});
	const [ns, setNS] = useState(false);
	const [f, setF] = useState(false);
	const stdId = useSelector((state) => state.user.id);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/student/get-classes", {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => {
				// console.log("called");
				console.log(data.data.classes);
				setClasses([...data.data.classes]);
			})
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
								<TableCell align="right">Teacher</TableCell>
								<TableCell align="right">
									Exam Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="center">Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{classes?.map((singleClass, i) => (
								<TableRow
									key={"sdfsd" + i}
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
										{new Date(singleClass?.startTime)
											.toLocaleTimeString()
											.slice(0, 4) +
											" " +
											new Date(singleClass?.startTime)
												.toLocaleTimeString()
												.slice(8)}
									</TableCell>
									<TableCell align="center">
										{singleClass?.status}
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

export default TodaysClassesOfStudent;
