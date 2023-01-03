import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
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

	const [cookies, setCookie] = useCookies([]);
	const handleSubmit = () => {
		// console.log(formData);

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
					msg: err.data.message,
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
						// value={formData.title}
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
						// value={formData.classDuration}
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
						// value={formData.startTime}
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
						// value={formData.startTime}
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
						// value={formData.startTime}
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
		</div>
	);
}

export default AddInstructor;
