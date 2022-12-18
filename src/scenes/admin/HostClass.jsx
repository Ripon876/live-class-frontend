import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
// import Autocomplete from "@mui/material/Autocomplete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

import axios from "axios";
import { useCookies } from "react-cookie";

function HostClass() {
	const [formData, setFormData] = useState({
		title: "",
		subject: "",
		teacher: "",
		classDuration: "",
		startTime: "10:30",
	});
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});
	const [cookies, setCookie] = useCookies([]);

	const handleChange = (e) => {
		setAlert({ ...alert, show: false });
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		console.log(formData);

		setAlert({
			show: true,
			type: "error",
			msg: "Something Went Wrong",
		});

		axios
			.post("http://localhost:5000/admin/create-new-class", formData, {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => {
				console.log(data.data);
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

	const teachers = [
		{
			value: "639de44baf8fb5796c4e518b",
			label: "Jhone Doe",
		},
		{
			value: "639de44baf8fb5796c4e518b",
			label: "Mark",
		},
		{
			value: "639de44baf8fb5796c4e518b",
			label: "Peter",
		},
		{
			value: "639de44baf8fb5796c4e518b",
			label: "Tony (:",
		},
	];

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
						required
						sx={{
							minWidth: "300px",
						}}
						onChange={handleChange}
					>
						{teachers.map((option) => (
							<MenuItem key={option.label} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="standard-number"
						label="Class Duration"
						type="number"
						name="classDuration"
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
					}}
					startIcon={<AddIcon />}
					onClick={handleSubmit}
				>
					Add
				</Button>
			</Box>

			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Today's Class Schedule
				</Typography>

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
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{new Array(5).fill(3).map(() => (
								<TableRow
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}
								>
									<TableCell component="th" scope="row">
										Frozen yoghurt
									</TableCell>
									<TableCell align="right">Math</TableCell>
									<TableCell align="right">
										Jhone Doe
									</TableCell>
									<TableCell align="right">10</TableCell>
									<TableCell align="right">
										10:30 AM
									</TableCell>
									<TableCell align="right">
										<Button
											variant="filled"
											startIcon={<DeleteIcon />}
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
		</div>
	);
}

export default HostClass;
