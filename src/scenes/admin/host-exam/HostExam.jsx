import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";
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
	const [studentsStates, setSS] = useState([]);
	const [canStart, setCanStart] = useState(false);
	const [spin, setSpin] = useState(false);
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});

	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("studentsStates", (states) => {
			setSS(Object.values(states));
		});

		socket.on("allClsTaken", () => {
			setSS([]);
			setAlert({
				show: true,
				type: "success",
				msg: "All exams has been taken",
			});
			closeAlert(setAlert);
			setSpin(false);
			checkExams(exams, setCanStart);
		});

		getExams(setExams, setCanStart);
		getExaminers(setExaminers);
		getRoleplayers(setRoleplayers);
	}, []);

	const handleChange = (e) => {
		setAlert({ ...alert, show: false });
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		Submit(
			formData,
			cookies.token,
			exams,
			setExams,
			setFormData,
			setAlert,
			setCanStart
		);
	};

	const deleteClass = (id) => {
		Delete(id, exams, setExams, setAlert, setCanStart);
	};

	const startexams = () => {
		Start(socket, setExams, setAlert, setSpin);
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
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<Typography variant="h4" className="mt-3">
						Today's Exam Schedule
					</Typography>
					<div style={{ cursor: spin ? "not-allowed" : "pointer" }}>
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
				</Box>

				<ExamsTable exams={exams} dltExm={deleteClass} />
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Box component="div" mb="20px">
					<Typography variant="h4" className="mb-3 mt-4">
						Joined Students
						{spin && <CachedIcon className="ms-2 spin" />}
					</Typography>
					<ExamStates states={studentsStates} />
				</Box>
			</Box>
		</div>
	);
}

export default HostClass;