import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import "./style.css";

function AddInstructor() {
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});
	const initialFormData = {
		name: "",
		email: "",
		password: "",
		phone: "",
		age: "",
	};
	const [formData, setFormData] = useState(initialFormData);
	const [teachers, setTeachers] = useState([]);
	const [instructor, setInstructor] = useState("");
	const [cookies, setCookie] = useCookies([]);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-teachers")
			.then((data) => setTeachers([...data.data.teachers]))
			.catch((err) => console.log("err :", err));
	}, []);

	const handleSubmit = () => {
		// console.log(formData);

		let emptyfield = Object.values(formData).some((item) => item == "");
		if (emptyfield) {
			setAlert({
				show: true,
				type: "error",
				msg: "enter all info proparly",
			});
			closeAlert();
			return;
		}

		axios
			.post(
				process.env.REACT_APP_SERVER_URL + "/admin/add_instructor",
				formData,
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setFormData(initialFormData);
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
					msg: err.response.data.message,
				});
				closeAlert();
			});
	};
	const handleChange = (e) => {
		setAlert({ ...alert, show: false });
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
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

	const removeInstructor = () => {
		axios
			.delete(
				process.env.REACT_APP_SERVER_URL + "/admin/remove-instructor",
				{
					data: {
						id: instructor,
					},
				}
			)
			.then((data) => {
				axios
					.get(
						process.env.REACT_APP_SERVER_URL + "/admin/get-teachers"
					)
					.then((data) => setTeachers([...data.data.teachers]))
					.catch((err) => console.log("err :", err));
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
					Add new instructor
				</Typography>

				<div>
					<TextField
						label="Name"
						name="name"
						defaultValue=""
						placeholder="Instructor name"
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
					<TextField
						label="Phone Number"
						type="number"
						name="phone"
						variant="filled"
						value={formData.phone}
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
					<TextField
						label="Age"
						type="number"
						name="age"
						variant="filled"
						value={formData.age}
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
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2 },
				}}
				m="50px"
				noValidate
				autoComplete="off"
			>
				<Typography variant="h3" mb="20px">
					Remove instructor
				</Typography>

				<div>
					<TextField
						id="filled-select-currency"
						select
						label="Select instructor"
						name="teacher"
						defaultValue="Jhone Doe"
						variant="filled"
						// value={instructor}
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={(e) => {
							setInstructor(e.target.value);
						}}
					>
						{teachers.map((teacher) => (
							<MenuItem value={teacher._id}>
								{teacher.name}
							</MenuItem>
						))}
					</TextField>
				</div>
				<Button
					variant="filled"
					sx={{
						mt: 1,
						ml: 2,
						boxShadow: 3,
					}}
					startIcon={<DeleteIcon />}
					onClick={removeInstructor}
				>
					Remove
				</Button>
			</Box>
		</div>
	);
}

export default AddInstructor;
