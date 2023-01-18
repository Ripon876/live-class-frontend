import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CachedIcon from "@mui/icons-material/Cached";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import AddExam from "./AddExam";
import ExamsTable from "./ExamsTable";
import ExamStates from "./ExamStates";
import "./style.css";

// helpers
import {
	Submit,
	Delete,
	checkExams,
	closeAlert,
	getExams,
	getExaminers,
	getRoleplayers,
	Start,
	Renew,
} from "./helpers";

let socket;

function HostClass() {
	const initialFormData = {
		title: "",
		subject: "",
		teacher: "",
		classDuration: "",
		startTime: "10:30",
		roleplayer: "",
		checklist: [],
	};
	const [formData, setFormData] = useState(initialFormData);
	const [cookies, setCookie] = useCookies([]);
	const [exams, setExams] = useState([]);
	const [examiners, setExaminers] = useState([]);
	const [roleplayers, setRoleplayers] = useState([]);
	const [value, setValue] = useState(null);
	const [studentsStates, setSS] = useState([]);
	const [canStart, setCanStart] = useState(false);
	const [canRenew, setCanRenew] = useState(false);
	const [spin, setSpin] = useState(false);
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.emit("getExamsStates", (sts) => {
			setSS(Object.values(sts));
			// console.log(Object.values(sts));
			if (Object.values(sts).length !== 0) {
				setSpin(true);
			}
		});

		socket.on("studentsStates", (states) => {
			setSS(Object.values(states));
			getExams(setExams, setCanStart);
		});

		socket.on("allClsTaken", () => {
			setSS([]);
			setAlert({
				show: true,
				type: "success",
				msg: "All exams has been taken",
			});
			getExams(setExams, setCanStart);
			closeAlert(setAlert);
			setSpin(false);
			checkExams(exams, setCanStart);
		});

		getExams(setExams, setCanStart);
		getRoles();
	}, []);

	const handleChange = (e) => {
		let evalue = e.target.value;
		setValue(evalue);
		setAlert({ ...alert, show: false });

		if (e.target.name === "startTime") {
			let time =
				new Date().toString().slice(0, 15) +
				" " +
				e.target.value +
				":00";
			setFormData({
				...formData,
				[e.target.name]: new Date(time).toUTCString(),
			});
		} else {
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			});
		}
	};

	const handleSubmit = () => {
		Submit(
			formData,
			cookies.token,
			exams,
			setExams,
			setFormData,
			setAlert,
			setCanStart,
			getRoles
		);
	};

	const deleteClass = (id) => {
		Delete(id, exams, setExams, setAlert, setCanStart, getRoles);
	};

	const getRoles = () => {
		getExaminers(setExaminers);
		getRoleplayers(setRoleplayers);
	};
	const startexams = () => {
		let confirmed = window.confirm(
			"Do you want to start exams? you will not be able to revert this"
		);
		if (confirmed) {
			Start(socket, setExams, setAlert, setSpin);
		}
	};

	const clearStates = () => {
		setSpin(false);
		socket.emit("clearStates", (sts) => {
			setSS(Object.values(sts));
		});
	};

	const renewExams = () => {
		let confirmed = window.confirm(
			"Do you want to renew exams? you will not be able to revert this"
		);
		if (confirmed) {
			Renew(cookies.token, setExams,setAlert);
		}
	};

	useEffect(() => {
		let tempExams = [...exams];
		let cr = tempExams.every((exam) => {
			return exam.status === "Finished";
		});
		setCanRenew(cr);
	}, [exams]);

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2 },
				}}
				m="50px"
				noValidate
				autoComplete="off"
			>
				<Snackbar
					open={alert.show}
					autoHideDuration={6000}
					onClose={() => {
						setAlert({
							msg: "",
							type: "",
							show: false,
						});
					}}
				>
					<Alert severity={alert.type} sx={{ mb: 2 }}>
						{alert.msg}
					</Alert>
				</Snackbar>
				<Typography variant="h3" mb="20px">
					Host a new exam
				</Typography>

				<AddExam
					fd={formData}
					hc={handleChange}
					hs={handleSubmit}
					examiners={examiners}
					roleplayers={roleplayers}
					sfd={setFormData}
				/>
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Box
					component="div"
					mb="20px"
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "end",
					}}
				>
					<Typography variant="h4" className="mt-3">
						Today's Exam Schedule
					</Typography>
					<div className="text-end">
						<div
							style={{ cursor: spin ? "not-allowed" : "pointer" }}
						>
							<Button
								variant="filled"
								sx={{
									boxShadow: 3,
								}}
								disabled={spin || !canStart}
								startIcon={<PlayArrowIcon />}
								onClick={startexams}
							>
								Start Today's Exams
							</Button>
						</div>
						<Button
							variant="filled"
							sx={{
								boxShadow: 3,
								mt: 1,
							}}
							disabled={!canRenew}
							startIcon={<HistoryIcon />}
							onClick={renewExams}
						>
							Renew Exams
						</Button>
					</div>
				</Box>

				<ExamsTable exams={exams} dltExm={deleteClass} />
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Box component="div" mb="20px"></Box>
				<Box
					component="div"
					mb="20px"
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Typography variant="h4" className="mb-3 mt-4">
						Joined Students
						{spin && <CachedIcon className="ms-2 spin" />}
					</Typography>
					<div style={{ cursor: spin ? "not-allowed" : "pointer" }}>
						<Button
							variant="filled"
							sx={{
								boxShadow: 3,
							}}
							disabled={!spin}
							startIcon={<DeleteIcon />}
							onClick={clearStates}
						>
							Clear States
						</Button>
					</div>
				</Box>
				<ExamStates states={studentsStates} />
			</Box>
		</div>
	);
}

export default HostClass;
