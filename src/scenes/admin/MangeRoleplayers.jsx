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
import { useCookies } from "react-cookie";
import Header from "../../components/Header";
import Instructors from "./Instructors";
import "./style.css";

function MangeRoleplayers() {
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
	const [roleplayers, setRolePlayers] = useState([]);
	const [instructor, setInstructor] = useState("");
	const [cookies] = useCookies([]);

	useEffect(() => {
		getRoleplayers();
	}, []);

	const handleSubmit = () => {
		// console.log(formData);

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
				process.env.REACT_APP_SERVER_URL + "/admin/add-roleplayer",
				formData,
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setFormData(initialFormData);
				getRoleplayers();
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

	const removeRoleplayer = (id) => {
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
				getRoleplayers();
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

	const getRoleplayers = () => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-roleplayers")
			.then((data) => {
				data.data.roles.map((user, i) => (user.id = i + 1));
				setRolePlayers([...data.data.roles]);
			})
			.catch((err) => console.log("err :", err));
	};

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Header title="Roleplayers" subtitle="Manage Roleplayers" />
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
				<Typography variant="h3" mb={0}>
					Add new roleplayer
				</Typography>

				<div>
					<TextField
						label="Name"
						name="name"
						defaultValue=""
						placeholder="roleplayer name"
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
					variant="contained"
					component="label"
					className="BTN"
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
			<Instructors instructors={roleplayers} rE={removeRoleplayer} />
		</div>
	);
}

export default MangeRoleplayers;
