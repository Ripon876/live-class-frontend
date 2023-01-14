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
import io from "socket.io-client";
let socket;

function TodaysClassesOfStudent() {
	const [cookies, setCookie] = useCookies([]);
	const [classes, setClasses] = useState([]);
	const [studentsStates, setSS] = useState({});
	const [ns, setNS] = useState(false);
	const [f, setF] = useState(false);
	const stdId = useSelector((state) => state.user.id);

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.emit("getStudentExamState", stdId, (sts) => {
			socket.emit("getClsId", stdId, (data, notstarted, finished) => {
				setSS(data);
				if (notstarted) {
					setNS(notstarted);
				}
				if (finished) {
					setF(finished);
				}
			});
		});

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
				<Box
					component="div"
					mt="50px"
					sx={{ display: "flex", justifyContent: "center" }}
				>
					{studentsStates?.canJoin ? (
						<>
							{studentsStates?.timeLeft - 0.5 > 0 ? (
								<Button
									size="large"
									variant="filled"
									sx={{
										boxShadow: 3,
										pt: "10px",
										pb: "10px",
									}}
									onClick={() => {
										window.location.href = `/live-class?id=${
											studentsStates.id
										}&d=${studentsStates.timeLeft - 0.5}`;
									}}
								>
									<Typography variant="h3">
										<PlayArrowIcon /> Rejoin
									</Typography>
								</Button>
							) : (
								<p>You can't join in break time</p>
							)}
						</>
					) : (
						<>
						{ns &&
							<p>Exams Not Started Yet</p>
						}
						{f &&
							<p>All Exams Ended</p>
						}
						</>
					)}
					 
				</Box>
			</Box>
		</div>
	);
}

export default TodaysClassesOfStudent;
