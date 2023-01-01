import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

function Settings() {
	const [cookies, setCookie] = useCookies([]);
	const [user, setUser] = useState({});
	const userType = useSelector((state) => state.type);
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/get-user-details", {
				headers: { Authorization: `Bearer ${cookies.token}` },
			})
			.then((data) => {
				setUser(data.data.user);
			})
			.catch((err) => {
				console.log("err : ", err);
			});
	}, []);

	const handleChange = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		axios
			.put(
				process.env.REACT_APP_SERVER_URL + "/update-user-details",
				user,
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => {
				setAlert({
					show: true,
					type: "success",
					msg: data.data.message,
				});
			})
			.catch((err) => {
				setAlert({
					show: true,
					type: "error",
					msg: err.data.message,
				});
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
					Update Profile
				</Typography>
				{user.name && (
					<div>
						<TextField
							label="Name"
							name="name"
							defaultValue={user.name}
							placeholder="your name"
							variant="filled"
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
							variant="filled"
							defaultValue={user?.email}
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
							label="Age"
							type="number"
							name="age"
							variant="filled"
							defaultValue={user?.age}
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
							label="Phone Number"
							type="tel"
							name="phone"
							variant="filled"
							defaultValue={user?.phone}
							required
							sx={{
								minWidth: "300px",
							}}
							InputLabelProps={{
								shrink: true,
							}}
							onChange={handleChange}
						/>
						{userType === "student" && (
							<>
								<TextField
									label="Address"
									type="text"
									name="address"
									variant="filled"
									defaultValue={user?.address}
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
									label="City"
									type="text"
									name="city"
									variant="filled"
									defaultValue={user?.city}
									required
									sx={{
										minWidth: "300px",
									}}
									InputLabelProps={{
										shrink: true,
									}}
									onChange={handleChange}
								/>
							</>
						)}
					</div>
				)}
				<Button
					variant="filled"
					sx={{
						mt: 1,
						ml: 2,
						boxShadow: 3,
					}}
					onClick={handleSubmit}
				>
					Save
				</Button>
			</Box>
		</div>
	);
}

export default Settings;
