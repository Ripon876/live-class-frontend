import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Header from "../../components/Header";
import { useCookies } from "react-cookie";
import "./style.css";
import Instructors from "./Instructors";

function MangeExaminers() {
	const [alert, setAlert] = useState({
		show: false,
		type: "success",
		msg: "",
	});

	const initialFormData = {
		name: "",
		email: "",
		password: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [teachers, setTeachers] = useState([]);
	const [instructor, setInstructor] = useState("");
	const [cookies] = useCookies([]);

	useEffect(() => {
		getExaminers();
	}, []);

	const handleSubmit = () => {
		let emptyfield = Object.values(formData).some((item) => item === "");
		if (emptyfield) {
			setAlert({
				show: true,
				type: "error",
				msg: "enter all info proparly",
			});

			return;
		}

		axios
			.post(
				process.env.REACT_APP_SERVER_URL + "/admin/add-instructor",
				formData,
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setFormData(initialFormData);
				getExaminers();
				setAlert({
					show: true,
					type: "success",
					msg: data.data.message,
				});
			})
			.catch((err) => {
				console.log("err : ", err);
				setAlert({
					show: true,
					type: "error",
					msg: err.response.data.message,
				});
			});
	};
	const handleChange = (e) => {
		setAlert({ ...alert, show: false });
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const removeInstructor = (id) => {
		axios
			.delete(
				process.env.REACT_APP_SERVER_URL + "/admin/remove-instructor",
				{
					data: {
						id: id,
					},
				}
			)
			.then((data) => {
				getExaminers();
				setAlert({
					show: true,
					type: "success",
					msg: data.data.message,
				});
			})
			.catch((err) => {
				console.log("err : ", err);
				setAlert({
					show: true,
					type: "error",
					msg: err.data.message,
				});
			});
	};

	const getExaminers = () => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-teachers")
			.then((data) => {
				data.data.teachers.map((user, i) => (user.id = i + 1));
				setTeachers([...data.data.teachers]);
			})
			.catch((err) => console.log("err :", err));
	};

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Header title="Examiners" subtitle="Manage Examiners" />
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2 },
				}}
				m="50px"
				mt={2}
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

				<Typography variant="h3"  mb={0}>
					Add new examiner
				</Typography>

				<div>
					<TextField
						label="Name"
						name="name"
						defaultValue=""
						placeholder="examiner name"
						variant="filled"
						value={formData.name}
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={handleChange}
					/>

					<TextField
						label="Email"
						type="email"
						name="email"
						value={formData.email}
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
						label="Password"
						type="password"
						name="password"
						variant="filled"
						value={formData.password}
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

			<Instructors instructors={teachers} rE={removeInstructor} />
		</div>
	);
}

export default MangeExaminers;
