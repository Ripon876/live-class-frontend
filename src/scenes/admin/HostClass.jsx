import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CachedIcon from "@mui/icons-material/Cached";
import axios from "axios";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import "./style.css";

let socket;

function HostClass() {
	const initialFormData = {
		title: "",
		subject: "",
		teacher: "",
		classDuration: "",
		startTime: "10:30",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});
	const [cookies, setCookie] = useCookies([]);
	const [classes, setClasses] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [studentsStates, setSS] = useState([]);
	const [canStart, setCanStart] = useState(false);
	const [spin, setSpin] = useState(false);

	const handleChange = (e) => {
		setAlert({ ...alert, show: false });
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		// console.log(formData);

		axios
			.post(
				process.env.REACT_APP_SERVER_URL + "/admin/create-new-class",
				formData,
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				// console.log(data.data);
				setFormData({
					...initialFormData,
				});
				setClasses([data.data.class, ...classes]);
				checkClasses([data.data.class]);
				setAlert({
					show: true,
					type: "success",
					msg: data.data.message,
				});
				closeAlert();
			})
			.catch((err) => {
				console.log("err : ", err);
				setAlert({
					show: true,
					type: "error",
					msg: err.data.message,
				});
				closeAlert();
			});
	};

	const deleteClass = (id) => {
		axios
			.delete(process.env.REACT_APP_SERVER_URL + "/admin/delete-class", {
				data: {
					id: id,
				},
			})
			.then((data) => {
				let newCLasses = classes.filter((cl) => cl._id !== id);
				setClasses(newCLasses);
				checkClasses(newCLasses);
				// setClasses([...classes, data.data.class]);
				setAlert({
					show: true,
					type: "success",
					msg: data.data.message,
				});
				closeAlert();
			})
			.catch((err) => {
				console.log("err : ", err);
				setAlert({
					show: true,
					type: "error",
					msg: err.data.message,
				});
				closeAlert();
			});
	};

	const subjects = [
		{
			value: "English",
			label: "English",
		},
		{
			value: "Math",
			label: "Math",
		},
		{
			value: "Physics",
			label: "Physics",
		},
		{
			value: "Biology",
			label: "Biology",
		},
	];

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("studentsStates", (states) => {
			setSS(Object.values(states));
			// console.log(states);
		});

		socket.on("allClsTaken", () => {
			setSS([]);
			setAlert({
				show: true,
				type: "success",
				msg: "All classes has been taken",
			});
			closeAlert();
			setSpin(false);
			checkClasses(classes);
		});

		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
			.then((data) => {
				setClasses([...data.data.classes].reverse());
				checkClasses(data.data.classes);
			})
			.catch((err) => console.log("err :", err));

		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-teachers")
			.then((data) => setTeachers([...data.data.teachers]))
			.catch((err) => console.log("err :", err));
	}, []);

	const startClasses = () => {
		// console.log('starting class')
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
			.then((data) => setClasses([...data.data.classes].reverse()))
			.catch((err) => console.log("err :", err));
		socket.emit("startClasses", (msg, err) => {
			if (msg) {
				setSpin(true);
				setAlert({
					show: true,
					type: "success",
					msg: msg,
				});
				closeAlert();
			} else {
				setAlert({
					show: true,
					type: "error",
					msg: err,
				});
				closeAlert();
			}
		});
	};

	const closeAlert = () => {
		setTimeout(() => {
			setAlert({
				show: false,
				type: "",
				msg: "",
			});
		}, 3500);
	};

	const checkClasses = (clses) => {
		if (clses.length === 0) {
			setCanStart(false);
			return;
		}
		for (let cls of clses) {
			if (cls.status === "Not Started") {
				setCanStart(true);
				return;
			}
		}
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2 },
				}}
				m="50px"
				noValidate
				autoComplete="off"
			>
				{alert.show && (
					<Alert severity={alert.type} sx={{ mb: 2 }}>
						{alert.msg}
					</Alert>
				)}

				<Typography variant="h3" mb="20px">
					Host a new class
				</Typography>

				<div>
					<TextField
						required
						id="title"
						label="Title"
						name="title"
						defaultValue=""
						placeholder="class title"
						variant="filled"
						value={formData.title}
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={handleChange}
					/>

					<TextField
						id="filled-select-currency"
						select
						label="Subject"
						name="subject"
						defaultValue="Subject"
						variant="filled"
						value={formData.subject}
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={handleChange}
					>
						{subjects.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="filled-select-currency"
						select
						label="Select Teacher"
						name="teacher"
						defaultValue="Jhone Doe"
						variant="filled"
						value={formData.teacher}
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={handleChange}
					>
						{teachers.map((teacher) => (
							<MenuItem value={teacher}>{teacher.name}</MenuItem>
						))}
					</TextField>
					<TextField
						id="standard-number"
						label="Class Duration"
						type="number"
						name="classDuration"
						value={formData.classDuration}
						variant="filled"
						required
						sx={{
							minWidth: "300px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
						onChange={handleChange}
					/>
					<TextField
						id="time"
						label="Start Time"
						type="time"
						name="startTime"
						defaultValue="10:30"
						variant="filled"
						value={formData.startTime}
						required
						sx={{
							minWidth: "300px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
						inputProps={{
							step: 300, // 5 min
						}}
						sx={{ width: 150 }}
						onChange={handleChange}
					/>
				</div>
				<Button
					variant="filled"
					sx={{
						mt: 1,
						ml: 2,
						boxShadow: 3,
					}}
					startIcon={<AddIcon />}
					onClick={handleSubmit}
				>
					Add
				</Button>
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Box
					component="div"
					mb="20px"
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Typography variant="h4" className="mt-3">
						Today's Class Schedule
					</Typography>
					<div style={{ cursor: spin ? "not-allowed" : "pointer" }}>
						<Button
							variant="filled"
							sx={{
								boxShadow: 3,
							}}
							disabled={spin || !canStart}
							startIcon={<PlayArrowIcon />}
							onClick={startClasses}
						>
							Start Today's Classes
						</Button>
					</div>
				</Box>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">Subject</TableCell>
								<TableCell align="right">Teacher</TableCell>
								<TableCell align="right">
									Class Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="right">Status</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{/*{classes.length === 0 & <p>No claases today</p>}*/}
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
										{singleClass.teacher.name}
									</TableCell>
									<TableCell align="right">
										{singleClass.classDuration}
									</TableCell>
									<TableCell align="right">
										{singleClass.startTime}
									</TableCell>
									<TableCell align="right">
										{singleClass.status}
									</TableCell>
									<TableCell align="right">
										<Button
											variant="filled"
											startIcon={<DeleteIcon />}
											onClick={() => {
												deleteClass(singleClass._id);
											}}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Box
					component="div"
					mb="20px"
					// sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Typography variant="h4" className="mb-3 mt-4">
						Joined Students
						{spin && <CachedIcon className="ms-2 spin" />}
					</Typography>
					<TableContainer component={Paper}>
						<Table
							sx={{ minWidth: "90%" }}
							aria-label="simple table"
						>
							{/*
}
{
    "cls": {
        "subject": "English",
        "teacher": "Teacher 1"
    },
    "student": "Student  1"
}
*/}

							<TableHead>
								<TableRow>
									<TableCell>#</TableCell>
									<TableCell align="right">Student</TableCell>
									<TableCell align="right">Subject</TableCell>
									<TableCell align="right">Teacher</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{studentsStates?.map((state, i) => (
									<TableRow
										sx={{
											"&:last-child td, &:last-child th":
												{
													border: 0,
												},
										}}
									>
										<TableCell component="th" scope="row">
											{i + 1}
										</TableCell>
										<TableCell align="right">
											{state.student}
										</TableCell>
										<TableCell align="right">
											{state.cls.subject}
										</TableCell>
										<TableCell align="right">
											{state.cls.teacher}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Box>
		</div>
	);
}

export default HostClass;
